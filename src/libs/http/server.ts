import axios, { isAxiosError } from "axios"
import { IS_SERVER } from "@/constant"
import { CreateServerAxiosOptions, getReferer, requestToAxiosRequestConfig, axiosResponseToFetchResponse } from "./common"
import { cookies, headers } from 'next/headers'
import { onTokenExpired } from "./refreshToken"
import { getQueryClient } from "../queryClient"

/**
 * @description
 * Don't use in React Component lifecycle.
 */
export const createServerAxios = (options: CreateServerAxiosOptions = {}) => {
  const instance = axios.create()
  instance.interceptors.request.use(
    async (config) => {
      if (IS_SERVER) {
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
      }
      return config
    }
  )
  instance.interceptors.response.use(
    null, 
    async (error: unknown) => {
      if (!isAxiosError(error)) return Promise.reject(error)
      if (error.response?.status === 401) {
        if (error.response?.data?.message === 'Token expired') {
          return await onTokenExpired(error)
        }
        const queryClient = getQueryClient()
        queryClient.clear();
        return Promise.reject(error)
      }
      return Promise.reject(error)
    }
  )
  instance.interceptors.request.use(options.request)
  instance.interceptors.response.use(options.response, options.fail)
  return instance
}

type RewriteHandler = (req: Request) => (string | ({
  changeOrigin?: boolean,
  target?: string,
  path: string,
}))

async function rewrite(request: Request, fn: RewriteHandler) {
  const data = fn(request)
  const { path, changeOrigin, target } = typeof data === 'string' ? { path: data } : data
  
  if (/^https?:\/\//.test(path)) {
    if (changeOrigin) {
      const urlObj = new URL(path)
      return new URL(target + urlObj.pathname + urlObj.search)
    }
    return new URL(path)
  }
  if (target) {
    return new URL(path, target)
  }
  const referer = await getReferer().catch(() => undefined)
  if (referer) {
    return new URL(path, referer)
  } else {
    return path
  }
}

interface HttpProxyOptions {
  rewrite?: RewriteHandler
}

export async function proxyMiddleware(request: Request, options: HttpProxyOptions = {}) {
  const config = await requestToAxiosRequestConfig(request)
  const url = rewrite ? await rewrite(request, options.rewrite) : config.url
  if (typeof url === 'string') {
    config.url = url
  } else {
    config.baseURL = url.origin
    config.url = url.pathname
    if (url.search) {
      config.params = url.searchParams
    }
  }
  try {
    const axiosResponse = await createServerAxios().request(config)
    const response = await axiosResponseToFetchResponse(axiosResponse)
    return response
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosResponse = error.response
      if (axiosResponse) {
        const response =  axiosResponseToFetchResponse(axiosResponse)
        return response
      }
    }
    return new Response("Internal Server Error", {
      status: 500,
      statusText: error.message,
    })
  }
}
