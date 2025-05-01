import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

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
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string(),
  group: z.string(),
  skill: z.string(),
  role: z.string(),
  role_Name: z.string(),
})

/**
 * 單一專案細節 Schema
 */
const ProjectDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  type: z.string(),
  industry: z.string(),
  duration: z.string(),
  background_Path: z.string(),
  description: z.string(),
  created: z.string(),
  creator: ProjectCreatorSchema,
  members: z.array(ProjectMemberResponseSchema),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
})

/**
 * 單一專案查詢回應 Schema
 */
const GetProjectByIdResponseDTOSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: ProjectDetailSchema,
})

/**
 * Route 定義 - GET /Project/{projectId}
 */
export const getProjectById = {
  method: 'GET',
  path: '/Project/:projectId',
  pathParams: z.object({
    projectId: z.string(),
  }),
  responses: {
    200: GetProjectByIdResponseDTOSchema,
  },
} as const satisfies AppRoute
