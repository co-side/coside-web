import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { InitClientArgs, initContract } from '@ts-rest/core'
import { z } from 'zod'
import { IS_DEV, IS_SERVER } from '@/constant'
import { deepMerge } from '@/utils/deepMerge'
import { CreateServerAxiosOptions, flattenAxiosConfigHeaders, getReferer } from './common'

const createClientAxios = (options: CreateServerAxiosOptions = {}) => {
  const instance = axios.create({})
  if (options.request) {
    instance.interceptors.request.use(options.request)
  }
  if (options.response) {
    instance.interceptors.response.use(options.response)
  }
  if (options.fail) {
    instance.interceptors.response.use(undefined, options.fail)
  }
  instance.interceptors.request.use(
    async (config) => {
      if (IS_SERVER) {
        try {
          const { cookies, headers } = await import('next/headers')
          let Authorization = null
          const accessTokenByHeader = headers().get('Authorization')
          if (accessTokenByHeader) {
            Authorization = headers().get('Authorization')
          }
          const accessTokenByCookie = cookies().get('access_token')?.value
          if (accessTokenByCookie) {
            if (accessTokenByCookie) {
              Authorization = `Bearer ${accessTokenByCookie}`
            }
          }
          if (Authorization) {
            config.headers['Authorization'] = Authorization
          }
        } catch {
          // 
        }
        const referer = await getReferer().catch(() => undefined)
        if (referer) {
          config.baseURL = referer
        } 
      }
      return config
    }
  )
  return instance
}

interface CreateHttpOptions<RequestDTO extends z.ZodType = z.AnyZodObject, ResponseDTO extends z.ZodType = z.AnyZodObject> {
  axiosOptions?: AxiosRequestConfig<z.infer<RequestDTO>>
  requestSchema?: RequestDTO
  responseSchema?: ResponseDTO
}

interface HttpClient<RequestDTO extends z.ZodType = z.ZodAny, ResponseDTO extends z.ZodType = z.AnyZodObject> {
  request: (config: AxiosRequestConfig<z.infer<RequestDTO>>) => Promise<AxiosResponse<z.infer<ResponseDTO>, z.infer<RequestDTO>>>
}

export function http<RequestDTO extends z.ZodType, ResponseDTO extends z.ZodType>(options: CreateHttpOptions<RequestDTO, ResponseDTO>): HttpClient<RequestDTO, ResponseDTO>
export function http(): HttpClient
export function http(options: CreateHttpOptions = {}): HttpClient {
  const instance = createClientAxios()
  instance.interceptors.request.use((config) => {
    const { requestSchema } = options
    if (requestSchema && IS_DEV) {
      const data = ['POST', 'PUT', 'PATCH'].includes(config.method) ? config.data : config.params
      const result = requestSchema.safeParse(data)
      if (result.success) {
        return result as unknown as AxiosRequestConfig['data']
      }
      else {
        console.warn('requestSchema', result.error.format())
      }
    }
    return config
  })
  instance.interceptors.response.use((response) => {
    const { responseSchema } = options
    if (responseSchema && IS_DEV) {
      const result = responseSchema.safeParse(response.data)
      if (result.success) {
        return result as unknown as AxiosResponse<z.infer<z.ZodAny>>
      }
      else {
        console.warn('responseSchema', result.error.format())
      }
    }
    return response
  })
  return {
    request: (config: AxiosRequestConfig) => {
      return instance.request(deepMerge(options.axiosOptions || {}, config))
    },
  }
}

export const contract = initContract()

export const defaultOptions = {
  baseUrl: '',
  api: async ({ path, method, headers, body }) => {
    try {
      const result = await http().request({
        method: method as Method,
        url: path,
        headers,
        data: body,
      })
      .catch((error) => {
        return Promise.reject(error)
      })
      return {
        status: result.status,
        body: result.data,
        headers: new Headers(flattenAxiosConfigHeaders(method, result.headers)),
      }
    }
    catch (e: unknown) {
      throw e
    }
  },
  validateResponse: IS_DEV,
} as const satisfies InitClientArgs
