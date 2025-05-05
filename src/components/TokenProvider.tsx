import { cookies } from "next/headers";
import AuthProvider from "./AuthProvider";
import { prefetchGetUser } from "@/services";

export default async function TokenProvider({ children }: { children?: React.ReactNode }) {
  const accessToken = cookies().get('access_token')?.value
  await Promise.all([
    prefetchGetUser({ enabled: !!accessToken }),
  ])
  return (
    <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
  )
}