import { API_SERVER_URL, IS_SERVER } from "@/constant"
import { CreateServerAxiosOptions } from "./common"
import axios, { isAxiosError } from "axios"
import { cookies } from 'next/headers'
import { onTokenExpired } from "./refreshToken"

/**
 * @description
 * Don't use in React Component lifecycle.
 */
export const createServerAxios = (options: CreateServerAxiosOptions = {}) => {
  const instance = axios.create({
    baseURL: API_SERVER_URL,
  })
  instance.interceptors.request.use(
    async (config) => {
      if (IS_SERVER) {
        const cookieStore = cookies()
        const accessToken = cookieStore.get('access_token')
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken.value}`
        }
      }
      return config
    }
  )
  instance.interceptors.response.use(
    null, 
    async (error: unknown) => {
      if (!isAxiosError(error)) return
      if (error.response?.status === 401) {
        if (error.response?.data?.message === 'Token expired') {
          return await onTokenExpired(error)
        }
      }
      return Promise.reject(error)
    }
  )
  instance.interceptors.request.use(options.request)
  instance.interceptors.response.use(options.response, options.fail)
  return instance
}
