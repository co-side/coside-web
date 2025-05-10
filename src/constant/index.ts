export const titleType = [
    { label: '專案上線', value: '專案上線' },
    { label: '純作品集', value: '純作品集' },
    { label: '主題未定', value: '主題未定' },
]

export const projectType = [
    { label: 'App', value: 'App' },
    { label: 'Web', value: 'Web' },
    // { label: 'SaaS', value: 'SaaS' },
    // { label: '實體/場域', value: '實體/場域' },
    { label: '其他', value: '其他' },
]

export const jobPosition = [
    { label: 'UI設計師', value: 'UI設計師' },
    { label: 'UX設計師', value: 'UX設計師' },
    { label: 'UIUX/產品設計師', value: 'UIUX/產品設計師' },
    { label: '使用者研究員', value: '使用者研究員' },
    { label: '前端工程師', value: '前端工程師' },
    { label: '後端工程師', value: '後端工程師' },
    { label: '全端工程師', value: '全端工程師' },
    { label: 'PM', value: 'PM' },
    { label: '其他', value: '其他' },
]

export const jobPositionTag = [
    { label: 'UI', value: 'UI設計師' },
    { label: 'UX', value: 'UX設計師' },
    { label: 'UIUX', value: 'UIUX/產品設計師' },
    { label: 'UXR', value: '使用者研究員' },
    { label: '前端', value: '前端工程師' },
    { label: '後端', value: '後端工程師' },
    { label: '全端', value: '全端工程師' },
    { label: 'PM', value: 'PM' },
    { label: '其他', value: '其他' },
]

export const duration = [
    { label: '未定', value: '未定' },
    { label: '1個月', value: '1個月' },
    { label: '2個月', value: '2個月' },
    { label: '3個月', value: '3個月' },
    { label: '3-6個月', value: '3-6個月' },
    { label: '6個月以上', value: '6個月以上' },
]


export const API_SERVER_URL = process.env.NEXT_PUBLIC_API_URL
export const IS_DEV = process.env.NODE_ENV === 'development'
export const IS_SERVER = typeof window === 'undefined'

export const AUTH_PAGES = [
    '/loginsetting'
  ]