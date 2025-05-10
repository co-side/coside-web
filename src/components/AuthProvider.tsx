'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AUTH_PAGES } from "@/constant";
import { fetchLogin, fetchLogout, fetchPreSignup } from "@/services/auth";

const AuthContext = createContext({
  isLogin: false,
  fetchLogout: (): Promise<unknown> => {
    throw new Error("Function not implemented.");
  },
})

interface AuthProviderProps {
  accessToken?: string
  children: React.ReactNode
}

function AuthProvider({ accessToken, children }: AuthProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLogin] = useState(!!accessToken)
  const router = useRouter()
  
  useEffect(() => {
    const redirectPath = searchParams.get('login_redirect_url')
    if (redirectPath) {
      location.href = redirectPath
    }
  }, [searchParams])

  const { mutateAsync: onLogin } = useMutation({
    mutationFn: () => {
      const accessToken = searchParams.get('accessToken')
      const refreshToken = searchParams.get('refreshToken')
      if (!accessToken || !refreshToken) {
        return Promise.reject(new Error("Invalid token"))
      }
      return fetchLogin({ accessToken, refreshToken })
    },
    onSuccess: async () => {
      const params = new URLSearchParams({
        login_redirect_url: pathname,
      })
      router.replace(`/?${params}`);
    }
  })

  const { mutateAsync: onPreSignup } = useMutation({
    mutationFn: () => {
      const accessToken = searchParams.get('accessToken')
      const refreshToken = searchParams.get('refreshToken')
      const email = searchParams.get('email')
      const name = searchParams.get('name')
      if (!accessToken || !refreshToken || !email || !name) {
        return Promise.reject(new Error("Invalid params"))
      }
      return fetchPreSignup({
        userInfo: JSON.stringify({ email, name }),
        signupToken: accessToken
      })
    },
    onSuccess: async () => {
      const email = searchParams.get('email')!
      const name = searchParams.get('name')!
      const params = new URLSearchParams({ name, email })
      router.replace(`/loginsetting?${params}`);
    }
  })

  const { mutateAsync: onLogout } = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      location.reload()
    }
  })

  useEffect(() => {
    const onMount = () => {
      const token = searchParams.get('accessToken')
      if (!token) return
      if (AUTH_PAGES.includes(pathname)) {
        onPreSignup()
      } else {
        onLogin()
      }
    }
    window.addEventListener('devicemotion', onMount)
    return () => {
      window.removeEventListener('devicemotion', onMount)
    }
  }, [onLogin, onPreSignup, pathname, searchParams])

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        fetchLogout: onLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.useAuth = () => useContext(AuthContext)

export default AuthProvider
