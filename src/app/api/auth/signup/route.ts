import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_SERVER_URL } from "@/constant";
import { proxyMiddleware, responseToNextResponse } from "@/libs/http/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const signupToken = request.cookies.get('signup_token')?.value
  if (!signupToken) {
    return new NextResponse('Token not Found!', { status: 403 })
  }
  const response = await proxyMiddleware(request, {
    rewrite: () => ({
      target: API_SERVER_URL,
      changeOrigin: true,
      path: '/signup'
    }),
    headers: [
      ['Authorization', `Bearer ${signupToken}`],
    ]
  })
  cookieStore.delete('signup_token')
  cookieStore.delete('signup_name')
  cookieStore.delete('signup_email')
  return responseToNextResponse(response)
}