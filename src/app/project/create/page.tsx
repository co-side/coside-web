import type { Metadata } from "next";
import CreateProject from "./CreateProject";
import { prefetchGetProjects } from "@/services/project/getProjects";

export const metadata: Metadata = {
  title: "Create Project",
};

export default async function CreateProjectPage() {
  await Promise.all([
    prefetchGetProjects()
  ])
  return <CreateProject />;
}
