import { IS_DEV, IS_SERVER } from '@/constant'

export async function cookies() {
  if (!IS_SERVER) {
    throw new Error('cookies() can only be called on the server side')
  }
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore
}

interface SetTokenParams {
  accessToken: string
  refreshToken: string
}

export async function setToken({ accessToken, refreshToken }: SetTokenParams) {
  const cookieStore = await cookies()
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    maxAge: 60 * 15, // 15分鐘
    path: '/',
    secure: !IS_DEV,
  })
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7天
    path: '/',
    secure: !IS_DEV,
  })
}
