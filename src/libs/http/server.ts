import axios, { isAxiosError } from "axios"
import { IS_SERVER } from "@/constant"
import { getReferer, requestToAxiosRequestConfig, axiosResponseToFetchResponse, flattenAxiosConfigHeaders } from "./common"
import { cookies, headers } from 'next/headers'
import { NextResponse } from "next/server"

/**
 * @description
 * Don't use in React Component lifecycle.
 */
export const createServerAxios = () => {
  if (!IS_SERVER) {
    throw new Error('createServerAxios should only be used in server side')
  }
  const instance = axios.create()
  instance.interceptors.request.use(
    async (config) => {
      try {
        let Authorization = null
        const accessTokenByHeader = headers().get('Authorization')
        if (accessTokenByHeader) {
          Authorization = headers().get('Authorization')
        }
        const accessTokenByCookie = cookies().get('access_token')?.value
        if (accessTokenByCookie) {
          Authorization = `Bearer ${accessTokenByCookie}`
        }
        if (Authorization) {
          config.headers['Authorization'] = Authorization
        }
      } catch (error) {
        //
      }
      return config
    }
  )
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

function setUrl<T extends { url?: string, baseURL?: string, params?: URLSearchParams }>(config: T, url: string | URL) {
  if (typeof url === 'string') {
    config.url = url
  }
  if (url instanceof URL) {
    config.baseURL = url.origin
    config.url = url.pathname
    if (url.search) {
      config.params = url.searchParams
    }
  }
}

interface HttpProxyOptions {
  rewrite?: RewriteHandler
  headers?: HeadersInit
}

export async function proxyMiddleware(request: Request, options: HttpProxyOptions = {}) {
  const config = await requestToAxiosRequestConfig(request)
  const url = options.rewrite ? await rewrite(request, options.rewrite) : config.url
  if (url) {
    setUrl(config, url)
  }
  if (options.headers) {
    const axiosHeaders = flattenAxiosConfigHeaders(config.method || 'get' ,config.headers)
    config.headers = Object.assign(axiosHeaders, Object.fromEntries(new Headers(options.headers || {}).entries()))
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

export async function responseToNextResponse(response: Response) {
  const headers = new Headers(response.headers)
  return new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
