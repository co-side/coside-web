'use client'

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { fetchRefreshToken, fetchLogout } from "@/services/auth"

function RefreshTokenPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const refreshRedirectUrl = searchParams.get('refresh_redirect_url')
    fetchRefreshToken()
      .then(() => {
        router.replace(refreshRedirectUrl || '/')
      })
      .catch(() => {
        return fetchLogout()
      })
      .catch(() => {
        router.replace('/')
      })
  }, [router, searchParams])

  return (
    <div></div>
  )
}

export default RefreshTokenPage
