import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

/**
 * 專案成員 Schema
 */
const CreateProjectMemberRequestSchema = z.object({
  group: z.string(), // 所屬組別，例如 "PM for task module"
  email: z.string().email(), // 成員 Email
  skill: z.string(), // 技能描述，例如 "Project management, Requirement analysis"
  role: z.string(), // 角色代碼，例如 "PM"
  role_Name: z.string(), // 角色名稱，例如 "PM"
})

/**
 * 建立專案的請求 Body Schema
 */
const CreateProjectRequestDTOSchema = z.object({
  name: z.string().min(3).max(40), // 專案名稱
  status: z.string().optional(), // 專案狀態（可選，像是 open, close, pause）
  type: z.string().min(1), // 專案類型
  industry: z.string().min(1).max(100), // 所屬產業
  duration: z.union([z.string(), z.null()]).optional(), // 專案期間
  background_Path: z.union([z.string(), z.null()]).optional(), // 背景圖片路徑
  generate_Background_Image: z.union([z.boolean(), z.null()]).optional(), // 是否透過 AI 產生背景圖
  description: z.string().min(1).max(3000), // 專案描述
  members: z.union([z.array(CreateProjectMemberRequestSchema), z.null()]).optional(), // 專案成員資訊
  categories: z.union([z.array(z.string()), z.null()]).optional(), // 專案分類
  tags: z.union([z.array(z.string()), z.null()]).optional(), // 專案標籤
})

/**
 * 專案創建者 Schema
 */
const ProjectCreatorSchema = z.object({
  id: z.string(), // 創建者 ID
  name: z.string(), // 創建者名稱
  avatar: z.string(), // 創建者頭像
  email: z.string().email(), // 創建者 Email
})

/**
 * 專案成員 Schema（回傳用）
 */
const ProjectMemberResponseSchema = z.object({
  id: z.string(), // 成員 ID
  name: z.string(), // 成員名稱
  email: z.string().email(),
  avatar: z.string(),
  group: z.string(),
  skill: z.string(),
  role: z.string(),
  role_Name: z.string(),
})

/**
 * 建立後的專案資料 Schema
 */
const CreatedProjectDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  type: z.string(),
  industry: z.string(),
  duration: z.string(),
  background_Path: z.string(),
  description: z.string(),
  created: z.string(), // ISO 日期格式
  creator: ProjectCreatorSchema,
  members: ProjectMemberResponseSchema,
  categories: z.array(z.string()),
  tags: z.array(z.string()),
})

/**
 * 建立專案回應 Schema
 */
const CreateProjectResponseDTOSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: CreatedProjectDetailSchema,
})

/**
 * Route 定義 - POST /Project
 */
export const createProject = {
  method: 'POST',
  path: '/Project',
  body: CreateProjectRequestDTOSchema,
  responses: {
    200: CreateProjectResponseDTOSchema,
  },
} as const satisfies AppRoute
