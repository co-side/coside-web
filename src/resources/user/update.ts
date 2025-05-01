import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

/**
 * 使用者詳細資料 Schema（同 GET /User 回傳格式）。
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
  role: z.string(), // 使用者角色
  intro: z.string(), // 自我介紹
  link: z.string().url(), // 個人網站連結
})

/**
 * 更新使用者資訊的 Request Body Schema。
 */
const UpdateUserRequestDTOSchema = z.object({
  name: z.union([z.string(), z.null()]).optional(), // 使用者名稱
  avatar: z.union([z.string(), z.null()]).optional(), // 使用者頭像路徑
  facebook: z.union([z.string(), z.null()]).optional(), // Facebook 連結
  instagram: z.union([z.string(), z.null()]).optional(), // Instagram 連結
  role: z.union([z.string().max(100), z.null()]).optional(), // 使用者角色，最長 100 字
  intro: z.union([z.string(), z.null()]).optional(), // 使用者自我介紹
  link: z.union([z.string(), z.null()]).optional(), // 使用者個人網站連結
})

/**
 * 回傳格式 Schema（成功時）。
 */
const UpdateUserResponseDTOSchema = z.object({
  success: z.literal(true), // 是否成功
  message: z.string(), // 回應訊息
  data: UserDetailSchema, // 更新後的使用者資料
})

/**
 * PUT /User/{userId} route 定義，更新目前驗證用戶的詳細資訊。
 */
export const updateUser = {
  method: 'PUT',
  path: '/User/:userId',
  pathParams: z.object({
    userId: z.string(), // 路徑參數：使用者 ID
  }),
  body: UpdateUserRequestDTOSchema, // 更新資料
  responses: {
    200: UpdateUserResponseDTOSchema,
  },
} as const satisfies AppRoute
