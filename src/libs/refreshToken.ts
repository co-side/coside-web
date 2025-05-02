import axios, { AxiosError } from 'axios'
import { API_SERVER_URL } from '@/constant'
import { cookies, setToken } from '../utils/cookie'

interface RefreshEvent {
  error: AxiosError
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}
const requestMap: Map<string, RefreshEvent[]> = new Map()

const fetchRefreshToken = async (info: {
  accessToken: string
  refreshToken: string
}) => {
  const response = await axios.request({
    baseURL: API_SERVER_URL,
    method: 'POST',
    url: '/auth/refresh',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${info.accessToken}`,
    },
    data: { refreshToken: info.refreshToken },
  })
  return response.data
}

export const onTokenExpired = (error: AxiosError<{ message: string }>) => {
  return new Promise(async (resolve, reject) => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const refreshToken = cookieStore.get('refresh_token')?.value
    if (!accessToken || !refreshToken) {
      return reject(new Error('No access token or refresh token found'))
    }
    if (!error.config) {
      return reject(new Error('No request config found'))
    }
    const event = {
      error,
      resolve,
      reject,
    } satisfies RefreshEvent
    if (requestMap.has(refreshToken)) {
      requestMap.set(refreshToken, [...requestMap.get(refreshToken)!, event])
    }
    else {
      requestMap.set(refreshToken, [event])
      const info = await fetchRefreshToken({ accessToken, refreshToken })
      await setToken({
        accessToken: info.accessToken,
        refreshToken: info.refreshToken,
      })
      const refreshEvents = requestMap.get(refreshToken)
      if (refreshEvents) {
        for (const e of refreshEvents) {
          const config = e.error.config!
          config.headers['Authorization'] = `Bearer ${info.accessToken}`
          axios.request(config).then(e.resolve).catch(e.reject)
        }
      }
      requestMap.delete(refreshToken)
    }
  })
}
