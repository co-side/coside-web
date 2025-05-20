/**
 * @path /api/auth/register
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_EXPIRE_TIME, API_SERVER_URL, IS_DEV, IS_SERVER, REFRESH_TOKEN_EXPIRE_TIME } from "@/constant";
import { RegisterRequestDTO, RegisterResponseDTO } from "@/services/auth";
import { createServerAxios } from "@/libs/http/server";

interface SignupRequestDTO {
  accessToken: string
  user: RegisterRequestDTO
}

interface SignupResponseDTO {
  data: {
    access_token: string
    refresh_token: string
  },
  message: string
}

export const fetchSignup = async (data: SignupRequestDTO): Promise<SignupResponseDTO> => {
  if (!IS_SERVER) {
    throw new Error('This function can only be used in server side')
  }
  const response = await createServerAxios().request({
    baseURL: API_SERVER_URL,
    method: 'POST',
    url: '/auth/signup',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.accessToken}`,
    },
    data: data.user,
  })
  return response.data
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const signupToken = request.cookies.get('signup_token')?.value
  if (!signupToken) {
    return new NextResponse('Token not Found!', { status: 403 })
  }
  const data: RegisterRequestDTO = await request.json()
  const response = await fetchSignup({
    accessToken: signupToken,
    user: data
  })
  cookieStore.delete('signup_token')
  cookieStore.delete('signup_name')
  cookieStore.delete('signup_email')
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
  const url = cookieStore.get('login_redirect_url')?.value
  return NextResponse.json({
    massage: 'Register Success!',
    data: {
      loginRedirectUrl: url || '/'
    }
  } satisfies RegisterResponseDTO)
}