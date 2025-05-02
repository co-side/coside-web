import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

/**
 * 專案成員 Schema（請求用）
 */
const UpdateProjectMemberRequestSchema = z.object({
  group: z.string(), // 所屬組別，例如 "PM for task module"
  email: z.string().email(), // 成員 Email
  skill: z.string(), // 技能描述
  role: z.string(), // 角色代碼
  role_Name: z.string(), // 角色名稱
})

/**
 * 更新專案的請求 Body Schema
 */
const UpdateProjectRequestDTOSchema = z.object({
  name: z.string().min(3).max(40), // 專案名稱
  status: z.string().optional(), // 專案狀態（open, close, pause）
  type: z.string().min(1), // 專案類型
  industry: z.string().min(1).max(100), // 所屬產業
  duration: z.union([z.string(), z.null()]).optional(), // 專案期間
  background_Path: z.union([z.string(), z.null()]).optional(), // 背景圖片路徑
  generate_Background_Image: z.union([z.boolean(), z.null()]).optional(), // 是否使用 AI 產生背景圖
  description: z.string().min(1).max(3000), // 專案描述
  members: z.union([z.array(UpdateProjectMemberRequestSchema), z.null()]).optional(), // 專案成員
  categories: z.union([z.array(z.string()), z.null()]).optional(), // 專案分類
  tags: z.union([z.array(z.string()), z.null()]).optional(), // 專案標籤
})

/**
 * 專案創建者 Schema
 */
const ProjectCreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  email: z.string().email(),
})

/**
 * 專案成員 Schema（回傳用）
 */
const ProjectMemberResponseSchema = z.object({
  name: z.string(),
  group: z.string(),
  email: z.string().email(),
  skill: z.string(),
  role: z.string(),
  role_Name: z.string(),
})

/**
 * 更新後的專案資料 Schema
 */
const UpdatedProjectDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  type: z.string(),
  industry: z.string(),
  duration: z.string(),
  background_Path: z.string(),
  description: z.string(),
  created: z.string(), // ISO 日期時間格式
  creator: ProjectCreatorSchema,
  members: z.array(ProjectMemberResponseSchema),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
})

/**
 * 更新專案的路由定義
 */
export const updateProject = {
  method: 'PUT',
  path: '/Project/:projectId',
  pathParams: z.object({
    projectId: z.string(), // 專案唯一識別碼
  }),
  body: UpdateProjectRequestDTOSchema,
  responses: {
    200: UpdatedProjectDetailSchema,
  },
} as const satisfies AppRoute
