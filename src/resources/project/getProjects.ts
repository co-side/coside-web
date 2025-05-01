import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

/**
 * 查詢參數 Schema，用來定義 API 支援的過濾條件與分頁設定。
 */
const GetProjectRequestDTOSchema = z.object({
  creators: z.union([z.array(z.string()), z.null()]).optional(), // 根據創建者名稱篩選專案
  types: z.union([z.array(z.string()), z.null()]).optional(), // 根據專案類型篩選
  industries: z.union([z.array(z.string()), z.null()]).optional(), // 根據產業類別篩選
  roles: z.union([z.array(z.string()), z.null()]).optional(), // 根據專案角色篩選
  tags: z.union([z.array(z.string()), z.null()]).optional(), // 根據標籤篩選
  categories: z.union([z.array(z.string()), z.null()]).optional(), // 根據分類篩選
  page: z.union([z.number().int().min(1), z.null()]).optional(), // 分頁頁碼，最小值為 1，預設為 1
  size: z.union([z.number().int().min(1), z.null()]).optional(), // 每頁筆數，最小值為 1，預設為 10
})

/**
 * 專案創建者資訊 Schema。
 */
const ProjectCreatorSchema = z.object({
  id: z.string(), // 創建者 ID
  name: z.string(), // 創建者姓名
  avatar: z.string(), // 頭像圖片路徑
  email: z.string().email(), // 創建者 Email
})

/**
 * 專案基本資訊 Schema。
 */
const ProjectSchema = z.object({
  id: z.string(), // 專案 ID
  name: z.string(), // 專案名稱
  status: z.string(), // 專案狀態，如 open/closed
  type: z.string(), // 專案類型
  industry: z.string(), // 專案所屬產業
  duration: z.string(), // 專案期間描述
  background_Path: z.string(), // 專案背景圖路徑
  creator: ProjectCreatorSchema, // 創建者資訊
  roles: z.array(z.string()), // 參與角色
  categories: z.array(z.string()), // 所屬分類
})

/**
 * 回傳格式 Schema（成功時）。
 */
const GetProjectResponseDTOSchema = z.object({
  success: z.literal(true), // 表示請求是否成功
  message: z.string(), // 回應訊息
  data: z.object({
    projects: z.array(ProjectSchema), // 專案列表
    total: z.number().int(), // 專案總數
  }),
})

/**
 * GET /Project route 定義，使用 ts-rest 格式。
 */
export const getProjects = {
  method: 'GET',
  path: '/Project',
  query: GetProjectRequestDTOSchema,
  responses: {
    200: GetProjectResponseDTOSchema,
  },
} as const satisfies AppRoute
