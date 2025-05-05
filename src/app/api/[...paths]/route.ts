import { NextRequest } from "next/server"
import { proxy } from "../proxy"

async function middleware(request: NextRequest) {
  return await proxy(request)
}

export const GET = middleware
export const POST = middleware
export const PUT = middleware
export const DELETE = middleware
export const PATCH = middleware
export const HEAD = middleware