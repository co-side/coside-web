/**
 * @path /api/auth/login
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_EXPIRE_TIME, IS_DEV, REFRESH_TOKEN_EXPIRE_TIME, API_SERVER_URL, IS_SERVER } from "@/constant";
import { LoginRequestDTO, LoginResponseDTO } from "@/services/auth";
import { createServerAxios } from "@/libs/http/server";

interface AuthExchangeRequestDTO {
  code: string
}

interface AuthExchangeResponseDTO {
  success: boolean,
  message: string,
  data: {
    access_token: string,
    refresh_token: string,
    name: string,
    email: string,
    isAlreadyUser: boolean
  }
}

const fetchAuthExchange = async ({ code }: AuthExchangeRequestDTO): Promise<AuthExchangeResponseDTO> => {
  if (!IS_SERVER) {
    throw new Error('This function can only be used in server side')
  }
  const response = await createServerAxios().request({
    baseURL: API_SERVER_URL,
    method: 'POST',
    url: '/auth/exchange',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { code },
  })
  return response.data
}

export async function POST(request: NextRequest) {
  const { code } = await request.json() as LoginRequestDTO
  if (!code) {
    return new NextResponse('Token not Found!', { status: 422 })
  }
  const response = await fetchAuthExchange({ code })
  const cookieStore = await cookies()
  if (!response.success) {
    return new NextResponse('Login Failed!', { status: 403 })
  }
  if (response.data.isAlreadyUser) {
    cookieStore.set('access_token', response.data.access_token, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXPIRE_TIME,
      path: '/',
      secure: !IS_DEV,
    })
    cookieStore.set('refresh_token', response.data.refresh_token, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRE_TIME,
      path: '/',
      secure: !IS_DEV,
    })
    return NextResponse.json({ 
      message: 'Login Success!',
      data: {
        isAlreadyUser: response.data.isAlreadyUser,
        loginRedirectUrl: '/'
      }
     } satisfies LoginResponseDTO)
  } else {
    cookieStore.set('signup_token', response.data.access_token, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXPIRE_TIME,
      path: '/',
      secure: !IS_DEV,
    })
    cookieStore.set('signup_name', response.data.name, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXPIRE_TIME,
      path: '/',
      secure: !IS_DEV,
    })
    cookieStore.set('signup_email', response.data.email, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXPIRE_TIME,
      path: '/',
      secure: !IS_DEV,
    })
    const params = new URLSearchParams({
      name: response.data.name,
      email: response.data.email,
    })
    return NextResponse.json({ 
      message: 'Login Success!',
      data: {
        isAlreadyUser: response.data.isAlreadyUser,
        loginRedirectUrl: `/auth/register?${params}`
      }
    } satisfies LoginResponseDTO)
  }
}
