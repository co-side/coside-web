'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { fetchLogin, fetchLogout, fetchRegister, RegisterRequestDTO } from "@/services/auth";
import { AuthContext } from "@/contexts/AuthContext";
import { clearGetUser, useGetUserQuery } from "@/services";

interface AuthProviderProps {
  accessToken?: string
  children: React.ReactNode
}

function AuthProvider({ accessToken, children }: AuthProviderProps) {
  const [isLogin, setIsLogin] = useState(!!accessToken)
  const router = useRouter()
  const { refetch: onRefetchUser, data: userData } = useGetUserQuery()

  const { mutateAsync: onLogout } = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      setIsLogin(false)
      clearGetUser()
    },
  })

  useEffect(() => {
    if (userData.data) {
      return
    }
    if (isLogin) {
      onRefetchUser().then((res) => {
        if (!res.data) {
          onLogout()
        }
      })
    }
  }, [])

  const { mutateAsync: onSignin } = useMutation({
    mutationFn: fetchLogin,
    onSuccess: async (res) => {
      if (res.data.isAlreadyUser) {
        await onRefetchUser()
        setIsLogin(true)
      }
      router.replace(res.data.loginRedirectUrl || '/')
    },
    onError: () => {
      router.replace('/')
    }
  })

  const { mutateAsync: onSignup } = useMutation({
    mutationFn: fetchRegister,
    onSuccess: async () => {
      await onRefetchUser()
      setIsLogin(true)
      router.replace('/')
    },
  })

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        fetchSignin: onSignin,
        fetchLogout: onLogout,
        fetchSignup: onSignup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
