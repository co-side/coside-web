import { z } from 'zod'
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios'
import { fetchRefreshToken, requestQueueFactory } from './refreshToken'
import { IS_DEV } from '@/constant'
import { RedirectError } from '../errors/RedirectError'
import { ServerComponentCookieError } from '../errors/ServerComponentCookieError'

export function serverAuthorizationPlugin() {
  return (instance: AxiosInstance) => {
    instance.interceptors.request.use(async (config) => {
      const { cookies, headers } = await import('next/headers')
      let Authorization = null
      try {
        const accessTokenByHeader = headers().get('Authorization')
        if (accessTokenByHeader) {
          Authorization = headers().get('Authorization')
        }
        const accessTokenByCookie = cookies().get('access_token')?.value
        if (accessTokenByCookie) {
          Authorization = `Bearer ${accessTokenByCookie}`
        }
        if (config.headers['Authorization']) {
          Authorization = config.headers['Authorization']
        }
      } catch {}
      config.headers['Authorization'] = Authorization
      const referer = headers().get('referer')
      if (referer) {
        config.baseURL = referer
      } 
      return config
    })
  }
}

export function requestValidationPlugin(schema: z.ZodType) {
  return (instance: AxiosInstance) => {
    instance.interceptors.request.use((config) => {
      const data = ['POST', 'PUT', 'PATCH'].includes(config.method || 'get') ? config.data : config.params
      const result = schema.safeParse(data)
      if (result.success) {
        return result as unknown as AxiosRequestConfig['data']
      }
      else {
        console.warn('requestSchema', result.error.format())
      }
      return config
    })
  }
}

export function responseValidationPlugin(schema: z.ZodType) {
  return (instance: AxiosInstance) => {
    instance.interceptors.response.use((response) => {
      const result = schema.safeParse(response.data)
      if (result.success) {
        return result as unknown as AxiosResponse<z.infer<z.ZodAny>>
      }
      else {
        console.warn('responseSchema', result.error.format())
      }
      return response
    })
  }
}

const refreshTokenErrorRetry = new Map<string, number>()

const executeRefreshToken = requestQueueFactory(
  (ctx: { error: AxiosError, instance: AxiosInstance }, resolve, reject) => ({ ctx, resolve, reject }),
  async (queue) => {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const refreshToken = cookieStore.get('refresh_token')?.value
    if (!accessToken || !refreshToken) {
      throw new Error('No access token or refresh token found')
    }
    const response = await fetchRefreshToken({ accessToken, refreshToken })
    const newAccessToken = response.data.accessToken
    try {
      cookieStore.set('access_token', newAccessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        path: '/',
        secure: !IS_DEV,
      })
    } catch (error) {
      if (refreshTokenErrorRetry.has(refreshToken)) {
        const count = refreshTokenErrorRetry.get(refreshToken)!
        if (count > 3) {
          refreshTokenErrorRetry.delete(refreshToken)
          throw new Error('Refresh token retry limit exceeded.')
        }
        refreshTokenErrorRetry.set(refreshToken, count + 1)
      }
      throw new ServerComponentCookieError({
        access_token: response.data.accessToken
      })
    }
    refreshTokenErrorRetry.delete(refreshToken)
    queue.forEach(({ ctx, resolve, reject }) => {
      const config = ctx.error.config
      if (config) {
        config['headers']['Authorization'] = `Bearer ${response.data.accessToken}`
        ctx.instance.request(config).then(resolve).catch(reject)
      }
    })
  }
)

export function refreshTokenPlugin() {
  return (instance: AxiosInstance) => {
    instance.interceptors.response.use(null, async (error) => {
      const { cookies, headers } = await import('next/headers')
      if (isAxiosError(error)) {
        const refreshToken = cookies().get('refresh_token')?.value
        if (error.response?.status === 401 && error.response.data?.message === 'Token expired' && refreshToken) {
          try {
            return await executeRefreshToken(refreshToken, { error, instance })
          } catch ($error) {
            if ($error instanceof ServerComponentCookieError) {
              // 透過判斷無法操作 cookie 來得知是否在 server component
              const referer = headers().get('referer')
              const params = new URLSearchParams({
                refresh_redirect_url: referer || '/',
                // 預期只有 access_token
                ...$error.cookieSet,
              })
              const redirectUrl = `/refresh?${params}`
              return Promise.reject(new RedirectError(error, redirectUrl))
            }
          }
        }
      }
      return Promise.reject(error)
    })
  }
}