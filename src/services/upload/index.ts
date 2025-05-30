import { http } from "@/libs/http/client";

interface UploadRequestDTO {
  file: File
  signupToken: string
}

interface UploadResponseDTO {
  message: string
  data: string
}

export function fetchUpload({ file, signupToken }: UploadRequestDTO): Promise<UploadResponseDTO> {
  const data = new FormData();
  data.append('file', file, file.name);
  return http().request({
    url: '/api/upload',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${signupToken}`
    },
    data,
    params: { type: 'images' }
  }).then((res) => res.data) as any
}
