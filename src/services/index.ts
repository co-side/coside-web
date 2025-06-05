import { GET_USER_QUERY } from './user/getUser'
import { GET_PROJECTS_QUERY, GET_PROJECTS_INFINITY_QUERY } from './project/getProjects'
import { GET_UNSPLASH_PHOTOS_QUERY_KEY } from './unsplash/photo'

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: typeof GET_USER_QUERY | typeof GET_PROJECTS_QUERY | typeof GET_PROJECTS_INFINITY_QUERY | GET_UNSPLASH_PHOTOS_QUERY_KEY | string[]
  }
}

export * from './user/getUser'
