'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { http } from "@/libs/http/client";
import { useMutation } from "@tanstack/react-query";
import { prefetchGetUser } from "@/services";

const AuthContext = createContext({
  isLogin: false,
  fetchLogout: (): Promise<unknown> => {
    throw new Error("Function not implemented.");
  },
})

interface AuthProviderProps {
  accessToken: string
  children: React.ReactNode
}

function AuthProvider({ accessToken, children }: AuthProviderProps) {
  const pathname = usePathname()
  const searchEntities = useSearchParams()
  const searchParams = new URLSearchParams([...searchEntities])
  const token = searchParams.get('token')
  const [isLogin, setIsLogin] = useState(!!accessToken)
  const router = useRouter()

  useEffect(() => {
    setIsLogin(!!accessToken)
  }, [accessToken])

  const { mutate: onLogin } = useMutation({
    mutationFn: async () => {
      await http().request({
        url: '/api/auth/login',
        method: 'POST',
        data: {
          accessToken: token
        }
      })
      await prefetchGetUser()
    },
    onSuccess: () => {
      setIsLogin(true)
      router.replace(pathname);
    }
  })

  useEffect(() => {
    const onMount = () => {
      if (token) {
        onLogin()
      }
    }
    window.addEventListener('devicemotion', onMount)
    return () => {
      window.removeEventListener('devicemotion', onMount)
    }
  }, [onLogin, token])

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        fetchLogout: () => {
          return http().request({
            method: "POST",
            url: "/api/auth/logout",
          })
          .then(() => {
            setIsLogin(false)
          })
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.useAuth = () => useContext(AuthContext)

export default AuthProvider