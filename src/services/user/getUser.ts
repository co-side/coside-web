import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { userClient as client } from '@/resources'
import { getQueryClient } from '@/libs/queryClient'
import { getUser } from '@/resources/user/getUser'

type ApiResource = typeof getUser

export type GetUserResponseDTO = z.infer<ApiResource['responses'][200]>

export const GET_USER_QUERY = ['getUser'] as const

const fetchFn = async (): Promise<GetUserResponseDTO> => {
  const res = await client.getUser()
  if (res.status === 200) return res.body
  throw res.body
}

const getQueryOptions = () => {
  return queryOptions({
    queryKey: GET_USER_QUERY,
    queryFn: () => fetchFn(),
  } as const)
}

export const useGetUserQuery = () => {
  return useSuspenseQuery(getQueryOptions())
}

export async function prefetchGetUser() {
  const queryClient = getQueryClient()
  const queryOptions = getQueryOptions()
  await queryClient.prefetchQuery(queryOptions)
  const result = queryClient.getQueryData(queryOptions.queryKey)
  return result
}

export async function clearGetUser() {
  const queryClient = getQueryClient()
  queryClient.removeQueries({ queryKey: GET_USER_QUERY })
}
