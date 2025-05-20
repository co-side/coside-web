import { http } from "@/libs/http/client";

export function fetchLogout() {
  return http().request({
    method: "POST",
    url: "/api/auth/logout",
  }).then((res) => res.data as any)
}
