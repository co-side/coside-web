import { API_SERVER_URL, IS_DEV, IS_SERVER } from "@/constant";
import axios, { AxiosError, AxiosInstance, isAxiosError } from "axios";
import { HttpError } from "./HttpError";

export function requestQueueFactory<Key, Context, Req, Res>(
  createContext: (req: Req, resolve: (res: Res) => void, reject: (error: unknown) => void) => Context,
  resolveQueue: (queue: Context[]) => Promise<void>,
): (key: Key, request: Req) => Promise<Res> {
  type ContextInfo = {
    queue: Context[]
    isRefreshing: boolean
  }
  const contextDict = new Map<Key, ContextInfo>()
  return (key, request) => {
    if (!contextDict.has(key)) {
      contextDict.set(key, {
        queue: [],
        isRefreshing: false,
      })
    }
    const info = contextDict.get(key)
    if (!info) {
      throw new Error('Context not found')
    }
    if (!info.isRefreshing) {
      resolveQueue(info.queue)
        .finally(() => {
          info.isRefreshing = false
          info.queue = []
          contextDict.delete(key)
        })
        info.isRefreshing = true
    }
    return new Promise<Res>((resolve, reject) => {
      info.queue.push(createContext(request, resolve, reject))
    })
  }
}

interface RefreshTokenRequestDTO {
  accessToken: string,
  refreshToken: string,
}

interface RefreshTokenResponseDTO {
  success: boolean,
  message: string,
  data: {
    accessToken: string,
  }
}

export const fetchRefreshToken = async ({ accessToken, refreshToken }: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> => {
  const instance = axios.create()
  if (!IS_SERVER) {
    throw new Error('This function can only be used in server side')
  }
  const response = await instance.request({
    baseURL: API_SERVER_URL,
    method: 'POST',
    url: '/auth/RefreshToken',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    data: { refreshToken },
  })
  return response.data
}

const refreshTokenErrorRetry = new Map<string, number>()

class SetCookieError extends Error {
  constructor(public cookieSet: Record<string, string>) {
    super(`Environment don't cookie set.`);
    this.name = "SetCookieError";
  }
}

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
      throw new SetCookieError({
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
            if ($error instanceof SetCookieError) {
              // 透過判斷無法操作 cookie 來得知是否在 server component
              const referer = headers().get('referer')
              const params = new URLSearchParams({
                refresh_redirect_url: referer || '/',
                // 預期只有 access_token
                ...$error.cookieSet,
              })
              const redirectUrl = `/auth/refresh?${params}`
              return Promise.reject(new HttpError(error, { redirectUrl }))
            }
          }
        }
      }
      return Promise.reject(error)
    })
  }
}