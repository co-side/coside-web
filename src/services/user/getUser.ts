import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { userClient as client } from '@/resources'
import { getQueryClient } from '@/libs/queryClient'
import { getUser } from '@/resources/user/getUser'

type ApiResource = typeof getUser

type GetUserResponseDTO = z.infer<ApiResource['responses'][200]>

export const GET_USER_QUERY = ['getUser'] as const

const fetchFn = (): Promise<GetUserResponseDTO> => {
  return client.getUser()
    .then((res) => {
      if (res.status === 200) {
        return res.body
      }
      return Promise.reject(new Error('Error fetching data'))
    })
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
