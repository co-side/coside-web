import { http } from "@/libs/http/client";

interface UploadRequestDTO {
  file: File
  token?: string
}

interface UploadResponseDTO {
  message: string
  data: string
}

export function fetchUpload({ file, token }: UploadRequestDTO): Promise<UploadResponseDTO> {
  const data = new FormData();
  data.append('file', file, file.name);
  return http().request({
    url: '/api/upload',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}` : undefined
    },
    data,
    params: { type: 'images' }
  }).then((res) => res.data) as any
}
