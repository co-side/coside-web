/**
 * @path /api/user
 */
import { NextRequest, NextResponse } from "next/server"
import { proxy, checkAuth } from "@/app/api/proxy"


async function middleware(request: NextRequest) {
  return await proxy(request)
}

export async function GET(request: NextRequest) {
  if (await checkAuth()) {
    return await middleware(request)
  }
  return NextResponse.json({
    message: '',
    data: null
  })
}

export const POST = middleware
export const PUT = middleware
export const DELETE = middleware
export const PATCH = middleware
export const HEAD = middleware