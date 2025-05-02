import { initClient } from '@ts-rest/core'
import { contract, defaultOptions } from '@/libs/http'
import { getUser } from './user/getUser'
import { updateUser } from './user/updateUser'
import { getUserById } from './user/getUserById'
import { getCreatorById } from './user/getCreatorById'
import { getProjects } from './project/getProjects'
import { getProjectById } from './project/getProjectById'
import { createProject } from './project/createProject'
import { updateProject } from './project/updateProject'
import { deleteProject } from './project/deleteProject'

export const userClient = initClient(
  contract.router({
    getUser,
    getUserById,
    updateUser,
    getCreatorById,
  }),
  defaultOptions,
)

export const projectClient = initClient(
  contract.router({
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
  }),
  defaultOptions,
)
