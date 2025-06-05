import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError, Method } from 'axios'
import { InitClientArgs, initContract } from '@ts-rest/core'
import { z } from 'zod'
import { IS_DEV, IS_SERVER, PUBLIC_DOMAIN_URL } from '@/constant'
import { flattenAxiosConfigHeaders } from './common'
import { requestValidationPlugin, responseValidationPlugin, serverAuthorizationPlugin } from './interceptors'
import { HttpError, isHttpError } from './HttpError'
// import { refreshTokenPlugin } from './refreshToken'

interface CreateHttpOptions<RequestDTO extends z.ZodType = z.AnyZodObject, ResponseDTO extends z.ZodType = z.AnyZodObject> {
  axiosOptions?: AxiosRequestConfig<z.infer<RequestDTO>>
  requestSchema?: RequestDTO
  responseSchema?: ResponseDTO
}

interface UseEvent {
  (type: 'request', fn: (p: AxiosRequestConfig) => Promise<AxiosRequestConfig>): void
  (type: 'response', fn: (p: AxiosResponse) => Promise<AxiosResponse>): void
  (type: 'requestError', fn: (p: unknown) => Promise<unknown>): void
  (type: 'responseError', fn: (p: unknown) => Promise<unknown>): void
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
  // plugins.push(refreshTokenPlugin())
  return {
    request: async (config): Promise<AxiosResponse<any, any>> => {
      const instance = axios.create({
        baseURL: PUBLIC_DOMAIN_URL
      })
      plugins.forEach((plugin) => {
        plugin(instance)
      })
      try {
        const { axiosOptions = {} } = options
        const response = await instance.request(Object.assign(axiosOptions, config))
        return response
      } catch (error) {
        if (isAxiosError(error)) {
          if (IS_DEV) {
            console.log('http client request error', {
              url: error.config?.url,
              status: error.status || error.response?.status,
              message: error.message || error.code,
            });
          }
          if (!isHttpError(error)) {
            throw new HttpError(error)
          }
        }
        throw error
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

function toURLSearchParams(value: unknown): URLSearchParams {
  const result = new URLSearchParams();
  if (typeof value === 'object' && value) {
    for (const key in value) {
      const val = (value as Record<string, unknown>)[key];
      if (Array.isArray(val)) {
        val.forEach((v) => result.append(key, String(v)));
      }
      if (typeof val === 'undefined' || val === null) {
        continue
      }
      result.append(key, String(val));
    }
  }
  return result
}



export const defaultOptions = {
  baseUrl: '/api',
  api: async ({ path, method, headers, body, fetchOptions, rawQuery }) => {
    const params = toURLSearchParams(rawQuery)
    const url = path.split('?')[0]
    try {
      const result = await http().request({
        method: method as Method,
        url: params.size ? `${url}?${params}` : url,
        headers,
        data: body,
        fetchOptions,
      })
      return {
        status: result.status,
        body: result.data,
        headers: new Headers(flattenAxiosConfigHeaders(method, result.headers)),
      }
    }
    catch (error: unknown) {
      if (isHttpError(error) && error.response) {
        return {
          status: error.response.status,
          body: error,
          headers: new Headers(flattenAxiosConfigHeaders(method, error.response.headers)),
        }
      }
      throw error
    }
  },
  validateResponse: IS_DEV,
} as const satisfies InitClientArgs
