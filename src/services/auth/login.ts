import { http } from "@/libs/http/client"
import { z } from "zod"

export interface LoginRequestDTO {
  code: string
}

const LoginRequestDTOSchema = z.object({
  code: z.string()
})

export interface LoginResponseDTO {
  message: string
  data: {
    isAlreadyUser: boolean
    loginRedirectUrl: string
  }
}

const LoginResponseDTOSchema = z.object({
  message: z.string(),
  data: z.object({
    isAlreadyUser: z.boolean(),
    loginRedirectUrl: z.string()
  })
})

export function fetchLogin({ code }: LoginRequestDTO): Promise<LoginResponseDTO> {
  return http({
    requestSchema: LoginRequestDTOSchema,
    responseSchema: LoginResponseDTOSchema
  }).request({
    url: '/api/auth/login',
    method: 'POST',
    data: { code }
  }).then((res) => res.data as any)
}
