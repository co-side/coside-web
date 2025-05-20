import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"

/**
 * @description
 * Convert AxiosRequestConfig headers to native Headers
 * @example
 * Used to convert AxiosRequestConfig headers to Headers for project custom http client
 * ```ts
 * import axios from 'axios'
 * 
 * axios.interceptors.request.use((config) => {
 *   const axiosHeaders = flattenAxiosConfigHeaders(config.method!, config.headers)
 *   const headers = new Headers(axiosHeaders)
 * })
 * ```
 */
export const flattenAxiosConfigHeaders = (method: string, headers: AxiosRequestConfig['headers']): Record<string, string> => {
  if (!headers) {
    return {}
  }
  if (headers instanceof AxiosHeaders) {
    return headers.toJSON() as unknown as Record<string, string>
  }
  const lowerMethod = method!.toLowerCase?.() || 'get'
  const commonHeaders = headers['common'] || {}
  const methodHeaders = headers[lowerMethod] || {}
  return {
    ...commonHeaders,
    ...methodHeaders,
    ...Object.fromEntries(
      Object.entries(headers).filter(
        ([key]) => !['common', 'get', 'post', 'put', 'patch', 'delete', 'head'].includes(key),
      ),
    ),
  }
}

/**
 * @description
 * Convert fetch API Request to AxiosRequestConfig
 * @example
 * Used to convert NextRequest to AxiosRequestConfig for axios request
 * ```ts
 * import { NextRequest, NextResponse } from 'next/server'
 * import axios from 'axios'
 * 
 * export async function GET(req: NextRequest) {
 *   const response = await axios.request(requestToAxiosRequestConfig(req))
 *   return NextResponse.json(response.data)
 * }
 * ```
 * @example
 * Used to convert NextRequest to AxiosRequestConfig for project custom http client
 * ```ts
 * import { NextRequest, NextResponse } from 'next/server'
 * import { http, requestToAxiosRequestConfig } from '@/shared/http'
 * 
 * export async function GET(req: NextRequest) {
 *   const response = await http().request(await requestToAxiosRequestConfig(req))
 *   return NextResponse.json(response.data)
 * }
 * ```
 */
export async function requestToAxiosRequestConfig(request: Request): Promise<AxiosRequestConfig> {
  const url = new URL(request.url)
  const headers = new AxiosHeaders()
  for (const [key, value] of request.headers.entries()) {
    headers.set(key, value)
  }
  headers.delete('cookie')
  headers.delete('referer')
  headers.delete('host')
  let body = undefined
  if (['POST', 'PUT', 'PATCH'].includes(request.method.toLocaleUpperCase())) {
    if (request.headers.get('content-type')?.includes('application/json')) {
      body = await request.json()
    }
    if (request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
      body = await request.formData()
    }
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      body = await request.formData()
    }
    if (!body) {
      body = await request.text()
    }
  }
  const config: AxiosRequestConfig = {
    url: `${url.pathname}${url.search}`,
    method: request.method,
    headers,
    data: body
  }
  return config
}

/**
 * @description
 * Convert AxiosResponse to fetch API Response
 * @example
 * Used to convert AxiosResponse to Response for Response
 * ```ts
 * import { http, axiosResponseToFetchResponse } from '@/shared/http'
 * 
 * export async function GET(request: NextRequest) {
 *   const response = await http().request(request)
 *   const jsonData = await axiosResponseToFetchResponse(response)
 *   return NextResponse.json(jsonData)
 * }
 */
export async function axiosResponseToFetchResponse(response: AxiosResponse): Promise<Response> {
  const headers = new Headers()
  const axiosHeaders = flattenAxiosConfigHeaders(response.config.method || 'get', response.headers)
  for (const [key, value] of [...Object.entries(axiosHeaders)]) {
    headers.set(key, value.toString())
  }
  headers.delete('set-cookie')
  headers.delete('cookie')
  if (headers.get("Content-Type")?.includes("application/json")) {
    return Response.json(response.data)
  }
  return new Response(response.data, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
