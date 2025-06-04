import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CLIENT_ID, UNSPLASH_ROOT } from "@/constant";

const GET_UNSPLASH_PHOTOS_QUERY = "unsplash-photos";

export type GET_UNSPLASH_PHOTOS_QUERY_KEY = [typeof GET_UNSPLASH_PHOTOS_QUERY, string]

type AlternativeSlugKeys = 'en' | 'es' | 'ja' | 'fr' | 'it' | 'ko' | 'de' | 'pt';

interface Urls {
  raw: string
  full: string
  regular: string
  small: string
  thumb: string
  small_s3: string
}

interface Links {
  self: string
  html: string
  download: string
  download_location: string
}

interface User {
  id: string
  updated_at: string
  username: string
  name: string
  first_name: string
  last_name: string
  twitter_username: any
  portfolio_url: string
  bio: string
  location: string
  links: Links2
  profile_image: ProfileImage
  instagram_username: string
  total_collections: number
  total_likes: number
  total_photos: number
  total_promoted_photos: number
  total_illustrations: number
  total_promoted_illustrations: number
  accepted_tos: boolean
  for_hire: boolean
  social: Social
}

interface Links2 {
  self: string
  html: string
  photos: string
  likes: string
  portfolio: string
  following: string
  followers: string
}

interface ProfileImage {
  small: string
  medium: string
  large: string
}

interface Social {
  instagram_username: string
  portfolio_url: string
  twitter_username: unknown
  paypal_email: unknown
}

export interface UnsplashData {
  id: string
  slug: string
  alternative_slugs: Record<AlternativeSlugKeys, string>
  created_at: string
  updated_at: string
  promoted_at: unknown
  width: number
  height: number
  color: string
  blur_hash: string
  description: unknown
  alt_description: string
  breadcrumbs: unknown[]
  urls: Urls
  links: Links
  likes: number
  liked_by_user: boolean
  current_user_collections: any[]
  sponsorship: any
  topic_submissions: unknown
  asset_type: string
  user: User
}

type GetResponseDTO = {
  results: UnsplashData[],
  total: number;
  total_pages: number;
}

const getPhotosByQuery = async (query: string, page: number = 1, limit: number = 12) => {
  const params = new URLSearchParams({
    query,
    per_page: limit.toString(),
    page: page.toString(),
    client_id: CLIENT_ID || '',
  })
  const { data } = await axios.get(`${UNSPLASH_ROOT}/search/photos?${params}`)
  return data
}

interface GetPhotosByQueryParams {
  query: string;
}

export const useUnsplashPhotoInfiniteQuery = (params: GetPhotosByQueryParams) => {
  return useInfiniteQuery({
    queryKey: [GET_UNSPLASH_PHOTOS_QUERY, params.query],
    queryFn: ({ pageParam = 1 }) => {
      return getPhotosByQuery(params.query, pageParam)
    },
    enabled: Boolean(params.query),
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetResponseDTO, all: GetResponseDTO[]) => {
      return lastPage.total_pages > all.length ? all.length + 1 : undefined;
    },
  })
}


export const downloadUnsplashImage = async (file: UnsplashData) => {
  // 壓縮參數
  let width = 1920;
  let quality = 80; // 初始品質
  const minQuality = 60; // 最低品質
  const fileSizeLimit = 3 * 1024 * 1024; // 3MB

  const fetchUnsplashImage = async (q: number) => {
    const params = new URLSearchParams({
      w: width.toString(),
      q: q.toString(),
      fm: 'jpg',
      fit: 'max'
    })
    const response = await axios.get(`${file.urls.raw}?${params}`, {
      responseType: "blob",
    });
    return response.data as Blob;
  }

  // 用 axios 獲取圖片 Blob 並檢查大小
  const compressAndGetQuality = async () => {
    let blob
    let q = quality
    while (true) {
      blob = await fetchUnsplashImage(q);
      // 確認後的 URL 和品質
      if (blob.size <= fileSizeLimit || q <= minQuality) {
        break
      }
      // 若大小不合格且品質未達最低，降低品質再試
      q -= 10;
    }
    return blob
  };

  // 獲取確認後的壓縮 URL 和品質以及 blob
  const compressedBlob = await compressAndGetQuality();

  // 使用前面已經取得的壓縮後 blob 來建立 File 物件
  return new File(
    [compressedBlob],
    `${file.id}.jpg`,
    { type: "image/jpeg" }
  );
}