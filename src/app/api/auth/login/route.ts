import { IS_DEV } from "@/constant";
import { expToMaxAge } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface LoginRequestBody {
  accessToken: string
  refreshToken?: string
}

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = await request.json() as LoginRequestBody
  if (!accessToken) {
    return new NextResponse('Token not Found!', { status: 422 })
  }
  const cookieStore = await cookies()
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    path: '/',
    secure: !IS_DEV,
  })
  if (refreshToken) {
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
      secure: !IS_DEV,
    })
  }
  return NextResponse.json({ message: 'Login Success!' })
}
