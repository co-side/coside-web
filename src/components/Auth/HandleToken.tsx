"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { userGetSelf } from "@/api/user";
import { setToken } from "@/api/tokeSetting";
import useLoginStore from "@/stores/loginStore";

export default function HandleToken() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setUserInfo } = useLoginStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = searchParams.get("token");
      if (!token) return;
      await setToken(token);

      const userInfo = await userGetSelf(token); // 這裡打 API 拿自己資訊
      setUserInfo(token, userInfo.data); // 儲存進 store
      // 移除 token from URL
      router.replace(pathname);
    };

    if (isReady) {
      init();
    }
  }, [isReady, searchParams, setUserInfo, pathname, router]);

  return null;
}
