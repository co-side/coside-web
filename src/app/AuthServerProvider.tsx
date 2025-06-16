import { cookies } from "next/headers";
import AuthProvider from "./AuthProvider";
import { Suspense } from "react";
import { prefetchGetUser } from "@/services";
import AuthErrorBoundary from "./AuthErrorBoundary";

async function AuthServerProvider({ children }: { children?: React.ReactNode }) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  if (accessToken) {
    await Promise.all([
      prefetchGetUser()
    ])
  }
  return (
    <Suspense>
      <AuthErrorBoundary>
        <AuthProvider accessToken={accessToken}>{children}</AuthProvider>
      </AuthErrorBoundary>
    </Suspense>
  )
}

export default AuthServerProvider
