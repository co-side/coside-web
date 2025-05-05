import { NextRequest, NextResponse } from "next/server";
import { API_SERVER_URL } from "@/constant";
import { proxyMiddleware } from "@/libs/http/server";

async function responseToNextResponse(response: Response) {
  const headers = new Headers(response.headers)
  return new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

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
