import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

/**
 * 使用者詳細資料 Schema。
 */
const UserDetailSchema = z.object({
  id: z.string(), // 使用者 ID
  name: z.string(), // 使用者姓名
  avatar: z.string(), // 使用者頭像圖片路徑
  email: z.string().email(), // 使用者電子郵件
  facebook: z.string().url(), // Facebook 連結
  is_Facebook_Public: z.boolean(), // Facebook 是否公開
  instagram: z.string().url(), // Instagram 連結
  is_Instagram_Public: z.boolean(), // Instagram 是否公開
  role: z.string(), // 使用者角色，例如 PM / Designer / Developer
  intro: z.string(), // 自我介紹
  link: z.string().url(), // 個人網站或作品集連結
})

/**
 * 回傳格式 Schema（成功時）。
 */
const GetUserResponseDTOSchema = z.object({
  success: z.literal(true), // 表示請求是否成功
  message: z.string(), // 回應訊息
  data: UserDetailSchema, // 使用者資料
})

/**
 * GET /User route 定義，取得目前驗證用戶的詳細資訊。
 */
export const getUser = {
  method: 'GET',
  path: '/user',
  responses: {
    200: GetUserResponseDTOSchema,
  },
} as const satisfies AppRoute
