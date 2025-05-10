import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError, Method } from 'axios'
import { InitClientArgs, initContract } from '@ts-rest/core'
import { z } from 'zod'
import { IS_DEV, IS_SERVER } from '@/constant'
import { deepMerge } from '@/utils/deepMerge'
import { flattenAxiosConfigHeaders } from './common'
import { refreshTokenPlugin, requestValidationPlugin, responseValidationPlugin, serverAuthorizationPlugin } from './interceptors'
import { RedirectError } from '../errors/RedirectError'

async function errorRedirectHandler(error: unknown): Promise<unknown> {
  const { redirect } = await import('next/navigation')
  let redirectUrl = null
  if (isAxiosError(error)) {
    if (error instanceof RedirectError) {
      redirectUrl = error.redirectUrl
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      redirectUrl = '/'
    }
  }
  if (redirectUrl) {
    redirect(redirectUrl)
  }
  return Promise.reject(error)
}

interface CreateHttpOptions<RequestDTO extends z.ZodType = z.AnyZodObject, ResponseDTO extends z.ZodType = z.AnyZodObject> {
  axiosOptions?: AxiosRequestConfig<z.infer<RequestDTO>>
  requestSchema?: RequestDTO
  responseSchema?: ResponseDTO
}

interface UseEvent {
  (type: 'request', fn: (p: AxiosRequestConfig) => Promise<AxiosRequestConfig>): void
  (type: 'response', fn: (p: AxiosResponse) => Promise<AxiosResponse>): void
  (type: 'requestError', fn: (p: AxiosError) => Promise<AxiosError>): void
  (type: 'responseError', fn: (p: AxiosError) => Promise<AxiosError>): void
  (type: string, fn: (...args: any[]) => any): void
}

interface HttpClient<RequestDTO extends z.ZodType = z.ZodAny, ResponseDTO extends z.ZodType = z.AnyZodObject> {
  request: (config: AxiosRequestConfig<z.infer<RequestDTO>>) => Promise<AxiosResponse<z.infer<ResponseDTO>, z.infer<RequestDTO>>>
  use: UseEvent
}

export function http<RequestDTO extends z.ZodType, ResponseDTO extends z.ZodType>(options: CreateHttpOptions<RequestDTO, ResponseDTO>): HttpClient<RequestDTO, ResponseDTO>
export function http(): HttpClient
export function http(options: CreateHttpOptions = {}): HttpClient {
  const plugins: ((instance: AxiosInstance) => void)[] = []
  const { requestSchema, responseSchema } = options
  if (IS_DEV && requestSchema) {
    plugins.push(requestValidationPlugin(requestSchema))
  }
  if (IS_DEV && responseSchema) {
    plugins.push(responseValidationPlugin(responseSchema))
  }
  if (IS_SERVER) {
    plugins.push(serverAuthorizationPlugin())
  }
  plugins.push(refreshTokenPlugin())
  return {
    request: async (config) => {
      const instance = axios.create()
      plugins.forEach((plugin) => {
        plugin(instance)
      })
      try {
        const response = await instance.request(deepMerge(options.axiosOptions || {}, config))
        return response
      } catch (error) {
        return Promise.reject(errorRedirectHandler(error))
      }
    },
    use: (type, fn) => {
      plugins.push((instance) => {
        if (type === 'request') instance.interceptors.request.use(fn as any)
        if (type === 'response') instance.interceptors.response.use(fn as any)
        if (type === 'requestError') instance.interceptors.response.use(null, fn as any)
        if (type === 'responseError') instance.interceptors.response.use(null, fn as any)
      })
    }
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
