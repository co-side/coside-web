import { NextRequest } from "next/server";
import { API_SERVER_URL } from "@/constant";
import { proxyMiddleware, responseToNextResponse } from "@/libs/http/server";
import { cookies, headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const response = await proxyMiddleware(request, {
    rewrite: () => ({
      target: API_SERVER_URL,
      changeOrigin: true,
      path: request.nextUrl.pathname.replace(/^\/api/, '')
    }),
  })
  .catch((error) => {
    console.log('server proxy error', error.message);
    return Promise.reject(error)
  })
  const nextResponse = await responseToNextResponse(response)
  return nextResponse
}

export async function checkAuth() {
  return !!cookies().get('access_token')?.value || !!headers().get('Authorization')
}