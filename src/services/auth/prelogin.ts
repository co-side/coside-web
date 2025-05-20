import { http } from "@/libs/http/client";

export function fetchPreLogin() {
  return http().request({
    url: '/api/auth/prelogin',
    method: 'POST',
  }).then((res) => res.data as any)
}
