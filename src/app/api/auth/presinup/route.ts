import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { expToMaxAge } from "@/utils/jwt";
import { IS_DEV } from "@/constant";

interface LoginRequestBody {
  signupToken: string
  userInfo: string
}

export async function POST(request: NextRequest) {
  const { signupToken, userInfo } = await request.json() as LoginRequestBody
  if (!signupToken || !userInfo) {
    return new NextResponse('Token not Found!', { status: 422 })
  }
  const maxAge = 1000 * 60 * 60
  const cookieStore = await cookies()
  cookieStore.set('signup_token', signupToken, {
    httpOnly: true,
    maxAge,
    path: '/',
    secure: !IS_DEV,
  })
  const { name, email } = JSON.parse(userInfo) as { email: string; name: string }
  cookieStore.set('signup_name', name, {
    httpOnly: true,
    maxAge,
    path: '/',
    secure: !IS_DEV,
  })
  cookieStore.set('signup_email', email, {
    httpOnly: true,
    maxAge,
    path: '/',
    secure: !IS_DEV,
  })
  return NextResponse.json({ message: 'Register Setup!' })
}
