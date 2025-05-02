import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { userClient as client } from '@/resources'
import { getQueryClient } from '@/libs/queryClient'
import { getUser } from '@/resources/user/getUser'

type ApiResource = typeof getUser

type GetUserResponseDTO = z.infer<ApiResource['responses'][200]>

export const GET_USER_QUERY = ['getUser'] as const

const fetchFn = async (): Promise<GetUserResponseDTO> => {
  const res = await client.getUser()
  if (res.status === 200) return res.body
  throw new Error(`getUser failed with status ${res.status}`)
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
  const options = getQueryOptions()
  await queryClient.prefetchQuery(options)
  const result = queryClient.getQueryData(options.queryKey)
  return result
}
