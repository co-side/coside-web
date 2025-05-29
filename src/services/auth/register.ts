import { http } from "@/libs/http/client"
import { AxiosResponse } from "axios"

export interface RegisterRequestDTO {
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

export interface RegisterResponseDTO {
  message: string
  data: {
    loginRedirectUrl: string
  }
}

export function fetchRegister(dto: RegisterRequestDTO): Promise<AxiosResponse<RegisterResponseDTO>> {
  return http().request({
    url: '/api/auth/register',
    method: 'POST',
    data: dto,
  }).then((res) => res.data as any)
}
