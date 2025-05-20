/**
 * @path /api/auth/prelogin
 */
import { ACCESS_TOKEN_EXPIRE_TIME, IS_DEV } from "@/constant";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const referrer = request.headers.get('Referrer')
  const cookieStore = await cookies()
  cookieStore.set('login_redirect_url', referrer || '/', {
    httpOnly: true,
    maxAge: ACCESS_TOKEN_EXPIRE_TIME,
    path: '/',
    secure: !IS_DEV,
  })
  return NextResponse.json({ message: 'Success!' })
}