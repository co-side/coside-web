import { http } from "@/libs/http/client"

export interface LoginRequestDTO {
  code: string
}

export interface LoginResponseDTO {
  message: string
  data: {
    isAlreadyUser: boolean
    loginRedirectUrl: string
  }
}

export function fetchLogin({ code }: LoginRequestDTO): Promise<LoginResponseDTO> {
  return http().request({
    url: '/api/auth/login',
    method: 'POST',
    data: { code }
  }).then((res) => res.data as any)
}
