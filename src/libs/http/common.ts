import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { NextRequest } from "next/server"

/**
 * @description
 * Convert NextRequest to AxiosRequestConfig
 * @example
 * Used to convert NextRequest to AxiosRequestConfig for axios request
 * ```ts
 * import { NextRequest, NextResponse } from 'next/server'
 * import axios from 'axios'
 * 
 * export async function GET(req: NextRequest) {
 *   const response = await axios.request(nextRequestToAxiosConfig(req))
 *   return NextResponse.json(response.data)
 * }
 * ```
 * @example
 * Used to convert NextRequest to AxiosRequestConfig for project custom http client
 * ```ts
 * import { NextRequest, NextResponse } from 'next/server'
 * import { http, nextRequestToAxiosConfig } from '@/shared/http'
 * 
 * export async function GET(req: NextRequest) {
 *   const response = await http().request(await nextRequestToAxiosConfig(req))
 *   return NextResponse.json(response.data)
 * }
 * ```
 */
export async function nextRequestToAxiosConfig(request: NextRequest): Promise<AxiosRequestConfig> {
  const url = new URL(request.nextUrl)
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
  config.url = config.url.replace('/api', '')
  return config
}

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

export interface CreateServerAxiosOptions {
  request?: (req: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>
  response?: (res: AxiosResponse) => Promise<AxiosResponse>
  fail?: (error: unknown) => Promise<unknown>
}