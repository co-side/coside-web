import { NextRequest } from "next/server";
import { API_SERVER_URL } from "@/constant";
import { proxyMiddleware, responseToNextResponse } from "@/libs/http/server";

export async function proxy(request: NextRequest) {
  const response = await proxyMiddleware(request, {
    rewrite: () => ({
      target: API_SERVER_URL,
      changeOrigin: true,
      path: request.nextUrl.pathname.replace(/^\/api/, '')
    }),
  })
  const nextResponse = await responseToNextResponse(response)
  return nextResponse
}
