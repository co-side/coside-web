import { GET_USER_QUERY } from './user/getUser'

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: typeof GET_USER_QUERY
  }
}

export * from './user/getUser'
