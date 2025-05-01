import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

/**
 * 參與專案的項目 Schema。
 */
const ParticipatedProjectSchema = z.object({
  id: z.string(), // 專案 ID
  name: z.string(), // 專案名稱
  type: z.string(), // 專案類型
  duration: z.string(), // 專案期間
  background_Path: z.string(), // 專案背景圖片路徑
  roles: z.array(z.string()), // 使用者在此專案中的角色
  categories: z.array(z.string()), // 專案分類
  is_Creator: z.boolean(), // 是否為專案創建者
})

/**
 * 創作者詳細資料 Schema。
 */
const CreatorDetailSchema = z.object({
  id: z.string(), // 創作者 ID
  name: z.string(), // 創作者姓名
  avatar: z.string(), // 頭像圖片路徑
  email: z.string().email(), // 創作者電子郵件
  facebook: z.union([z.string().url(), z.null()]), // Facebook 連結或 null
  is_Facebook_Public: z.boolean(), // Facebook 是否公開
  instagram: z.union([z.string().url(), z.null()]), // Instagram 連結或 null
  is_Instagram_Public: z.boolean(), // Instagram 是否公開
  role: z.string(), // 擔任角色
  intro: z.union([z.string(), z.null()]), // 自我介紹或 null
  link: z.union([z.string().url(), z.null()]), // 個人連結或 null
  projects: z.array(ParticipatedProjectSchema), // 參與的專案
})

/**
 * 回傳格式 Schema（成功時）。
 */
const GetCreatorDetailResponseDTOSchema = CreatorDetailSchema

/**
 * GET /User/creator/:creatorId route 定義，取得指定創作者詳細資訊。
 */
export const getCreatorById = {
  method: 'GET',
  path: '/User/creator/:creatorId',
  pathParams: z.object({
    creatorId: z.string(), // 路徑參數：創作者 ID
  }),
  responses: {
    200: GetCreatorDetailResponseDTOSchema,
  },
} as const satisfies AppRoute
