import { API_SERVER_URL, IS_SERVER } from "@/constant";
import axios from "axios";

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
    url: '/RefreshToken',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    data: { refreshToken },
  })
  return response.data
}
