/**
 * @path /api/auth/refresh
 */
import { IS_DEV } from "@/constant";
import { fetchRefreshToken } from "@/libs/http/refreshToken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const requestBody = await request.json() as { accessToken: string }
  const refreshToken = request.cookies.get('refresh_token')?.value
  if (!refreshToken) {
    return new NextResponse('Token not Found!', { status: 403 })
  }
  const response = await fetchRefreshToken({ accessToken: requestBody.accessToken, refreshToken })
  const cookieStore = await cookies()
  cookieStore.set('access_token', response.data.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    path: '/',
    secure: !IS_DEV,
  })
  return NextResponse.json({ message: 'Refresh Token!' }, { status: 200 })
}