import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { userClient as client } from '@/resources'
import { getQueryClient } from '@/libs/queryClient'
import { getUser } from '@/resources/user/getUser'

type ApiResource = typeof getUser

export type GetUserResponseDTO = z.infer<ApiResource['responses'][200]>

export const GET_USER_QUERY = ['getUser'] as const

const fetchFn = (): Promise<GetUserResponseDTO> => {
  return client.getUser().then((res) => {
    if (res.status === 200) return res.body
    throw new Error(`fetch error: Status is not define, ${res.status} by getUser.`)
  })
}


interface QueryOptions {
  enabled?: boolean
}

const getQueryOptions = ({ enabled }: QueryOptions) => {
  return queryOptions({
    queryKey: GET_USER_QUERY,
    queryFn: () => {
      if (enabled === false) return null
      return fetchFn() 
    }
  } as const)
}

export const useGetUserQuery = (options: QueryOptions = {}) => {
  return useSuspenseQuery(getQueryOptions(options))
}

export async function prefetchGetUser(options: QueryOptions = {}) {
  const queryClient = getQueryClient()
  const queryOptions = getQueryOptions(options)
  queryOptions.staleTime = 0
  await queryClient.prefetchQuery(queryOptions)
  const result = queryClient.getQueryData(queryOptions.queryKey)
  return result
}
