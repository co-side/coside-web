'use client'
import { createContext, useContext, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { http } from "@/libs/http/client";
import { useGetUserQuery } from "@/services";

const AuthContext = createContext({
  isLogin: false,
})

interface AuthProviderProps {
  isLogin: boolean
  children: React.ReactNode
}

function AuthProvider({ isLogin, children }: AuthProviderProps) {
  const pathname = usePathname()
  const searchEntities = useSearchParams()
  const searchParams = new URLSearchParams([...searchEntities])
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      http().request({
        url: '/self/api/login',
        method: 'POST',
        data: {
          accessToken: token
        }
      })
        .then(() => {
          window.location.href = pathname
        })
    }
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        isLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.useAuth = () => useContext(AuthContext)

export default AuthProvider