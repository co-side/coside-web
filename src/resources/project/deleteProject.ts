import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

/**
 * 刪除專案的回應 Schema
 */
const DeleteProjectResponseDTOSchema = z.object({
  success: z.boolean(), // API 是否成功執行
  message: z.string(), // 回應訊息（例如 "Operation completed successfully."）
})

/**
 * 刪除專案的路由定義
 */
export const deleteProject = {
  method: 'DELETE',
  path: '/Project/:projectId',
  pathParams: z.object({
    projectId: z.string(), // 專案唯一識別碼
  }),
  responses: {
    200: DeleteProjectResponseDTOSchema,
  },
} as const satisfies AppRoute
