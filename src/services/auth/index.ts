import { http } from "@/libs/http/client";
import { AxiosResponse } from "axios";

interface LoginRequestDTO {
  accessToken: string
  refreshToken: string
}

export function fetchLogin({ accessToken }: LoginRequestDTO) {
  return http().request({
    url: '/api/auth/login',
    method: 'POST',
    data: {
      accessToken
    }
  })
}

interface PreSignupRequestDTO {
  signupToken: string
  userInfo: string
}

export function fetchPreSignup({ signupToken, userInfo }: PreSignupRequestDTO) {
  return http().request({
    url: '/api/auth/presinup',
    method: 'POST',
    data: {
      signupToken,
      userInfo
    }
  })
}

interface SignupRequestDTO {
  name: string
  email: string
  emailPublic: boolean
  facebook: string
  isfacebookpublic: boolean
  instagram: string
  isinstagrampublic: boolean
  role: string
  otherRole: string
  intro: string
  link: string
  avatar: string
  password: string
}

interface SignupResponseDTO {
  data: {
    accessToken: string
    refreshToken: string
  },
  message: string
}

export function fetchSignup(dto: SignupRequestDTO): Promise<AxiosResponse<SignupResponseDTO>> {
  return http().request({
    url: '/api/auth/signup',
    method: 'POST',
    data: dto,
  }) as any
}

export function fetchLogout() {
  return http().request({
    method: "POST",
    url: "/api/auth/logout",
  })
}

export function fetchRefreshToken() {
  return http().request({
    url: '/api/auth/refresh',
    method: 'POST',
  })
}