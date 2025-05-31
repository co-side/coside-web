import { queryOptions, useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { projectClient as client } from '@/resources'
// import { getQueryClient } from '@/libs/queryClient'
import { getProjects } from '@/resources/project/getProjects'

type ApiResource = typeof getProjects

type InferArray<T extends any[]> = T extends (infer U)[] ? U : never

export type GetProjectRequestDTO = z.infer<ApiResource['query']>
export type GetProjectsResponseDTO = z.infer<ApiResource['responses'][200]>
export type ProjectModel = InferArray<GetProjectsResponseDTO['data']['projects']>

export const GET_PROJECTS_QUERY = ['getProjects'] as const

const fetchFn = async (req: GetProjectRequestDTO = {}): Promise<GetProjectsResponseDTO> => {
  const res = await client.getProjects({ query: req })
  if (res.status === 200) return res.body
  throw res.body
}

const getQueryOptions = () => {
  return queryOptions({
    queryKey: GET_PROJECTS_QUERY,
    queryFn: () => fetchFn(),
  } as const)
}

export const useGetProjectsFirstQuery = () => {
  return useSuspenseQuery({
    ...getQueryOptions(),
    select: (res) => res.data
  })
}

const PAGE_SIZE = 10

export interface GetProjectsInfiniteQueryParams extends GetProjectRequestDTO {
  pageSize?: number
}

export const GET_PROJECTS_INFINITY_QUERY = ['getProjects', 'infinite'] as const

export const useGetProjectsInfiniteQuery = (req: GetProjectsInfiniteQueryParams = {}) => {
  const pageSize = req.pageSize || PAGE_SIZE
  return useInfiniteQuery({
    queryKey: GET_PROJECTS_INFINITY_QUERY,
    queryFn: (ctx) => {
      return fetchFn({ ...req, page: ctx.pageParam, size: pageSize })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetProjectsResponseDTO, allPages: GetProjectsResponseDTO[]) => {
      const all = allPages.map((item) => item.data.projects).flat()
      const currentPage = Math.ceil(all.length / pageSize)
      const nextPage = currentPage + 1
      return lastPage.data.projects.length >= pageSize ? nextPage : undefined
    },
    select: (res) => {
      return res.pages.map((item) => item.data.projects).flat()
    },
  })
}