import { z } from 'zod'
import { projectClient as client } from '@/resources'
import { createProject as resource } from '@/resources/project/createProject'

export type CreateProjectRequestDTO = z.infer<typeof resource['body']>
export type CreateProjectResponseDTO = z.infer<typeof resource['responses'][200]>

export const createProject = async (req: CreateProjectRequestDTO): Promise<CreateProjectResponseDTO> => {
  const res = await client.createProject({ body: req })
  if (res.status === 200) return res.body
  throw res.body
}
