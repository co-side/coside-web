'use client';

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

function LogoutPage() {
  const { fetchLogout } = useAuth()

  useEffect(() => {
    const onMount = async () => {
      await fetchLogout()
    }
    window.addEventListener('devicemotion', onMount)
    return () => {
      window.removeEventListener('devicemotion', onMount)
    }
  }, [fetchLogout])

  return <div></div>;
}

export default LogoutPage;