"use client";
import { useSearchParams,useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import useLoginStore from "@/stores/loginStore";
// import test from "@/app/api/test";
import axios from "axios";

export default function HandleToken() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setToken } = useLoginStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {


    const token = searchParams.get("token");
    if(!token) return;
    router.replace(pathname);
    console.log(token);

    setToken(token);
  }, [isReady, searchParams, setToken]);

  return null;
}
