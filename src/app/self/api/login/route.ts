import { NextRequest, NextResponse } from "next/server";
import { setToken } from "@/libs/http/refreshToken";

interface LoginRequestBody {
  accessToken: string
}

export async function POST(request: NextRequest) {
  const { accessToken } = await request.json() as LoginRequestBody
  if (!accessToken) {
    return new NextResponse('Token not Found!', { status: 422 })
  }
  await setToken({ accessToken })
  return NextResponse.json({ message: 'Login Success!' })
}
