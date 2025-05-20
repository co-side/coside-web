import { http } from "@/libs/http/client";

export function fetchRefreshToken() {
  return http().request({
    url: '/api/auth/refresh',
    method: 'POST',
  }).then((res) => res.data as any)
}
