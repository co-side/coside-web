'use client'
import { isAxiosError } from "axios";
import { ErrorBoundary } from "react-error-boundary";
import { isHttpError } from "@/libs/http/HttpError";
import { fetchLogout } from "@/services/auth";
import { IS_SERVER } from "@/constant";

const onServerError = async (error: unknown) => {
  console.error("Server Error:", error);
  const { redirect } = await import('next/navigation');
  const { cookies } = await import('next/headers');
  if (isHttpError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      cookies()?.delete("access_token");
      cookies()?.delete("refresh_token");
      redirect("/");
    }
  }
}
const onClientError = (error: unknown) => {
  console.error("Client Error:", error);
  if (isHttpError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      fetchLogout().then(() => {
        window.location.href = "/";
      });
    }
  }
};

interface AuthErrorBoundaryProps {
  children: React.ReactNode
}

function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const fallbackRender = ({ error }: { error: unknown }) => {
    if (isAxiosError(error)) {
      console.log('AuthErrorBoundary', JSON.stringify(error, null, 2));
      
      if (IS_SERVER) {
        onServerError(error)
      } else {
        onClientError(error)
      }
      return <div>{error.message}</div>
    }
    throw error
  }
  return <ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>
}

export default AuthErrorBoundary;
