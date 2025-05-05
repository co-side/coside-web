# API 通信機制文檔

## 系統架構概述

該系統實現了一個現代化的前後端分離應用程序的 API 通信架構，基於 Next.js 框架。系統主要包括以下幾個核心組件：

1. **Client Component**
2. **Server Component**
3. **Middleware** - 處理 API 路由和身份驗證
4. **Next App** - 前端到 API 伺服器
5. **Backend API Service** - 後端 API 伺服器

下面是 API 系統架構：

```mermaid
graph TD
    A[Client Component] -->|客戶端請求| C[Next.js middleware]
    B[Server Component] -->|客戶端請求| C[Next.js middleware]
    C -->|如果為後端服務的路徑| D[HTTP 代理]
    C -->|如果為 Next 服務的路徑| F[本地 Next App]
    D -->|轉發請求| E[Backend API Service 伺服器]
```

## 核心功能詳解

### 1. API 中間件 ([...paths]/route.ts)

中間件是系統的入口點，負責處理所有傳入請求的初步處理和路由。

**主要功能**：

- API 路由代理：將 `/api/*` 路徑下的請求轉發到後端 API 服務器

```ts
// 簡化示例
export async function middleware(request: NextRequest) {
  return await proxy(request)
}
```

### 2. HTTP 客戶端 (client.ts)

客戶端模塊提供了用於前端發送 API 請求的工具函數和配置。

**主要功能**：

- `createClientAxios`: 創建和配置 Axios 實例
- `http`: 創建具有請求和響應模式驗證功能的 HTTP 客戶端
- `contract`: 初始化 API 合約，用於類型安全的 API 調用

**特點**：

- 支持 Zod 模式驗證
- 自動處理身份驗證令牌
- 開發環境下的請求/響應驗證

#### `http` 使用範例

```ts
const response = await  http().request({
  method: 'POST',
  url: '/users',
  data: { name: 'John' }
});
```

```ts
const apiClient = http({
  requestSchema: z.object({ name: z.string() }),
  responseSchema: z.object({ id: z.number(), name: z.string() })
});

const response = await apiClient.request({
  method: 'POST',
  url: '/users',
  data: { name: 'John' }
});
```

### 3. HTTP 代理 (server.ts)

服務器端 HTTP 代理負責在 Next.js 服務器端轉發請求到後端 API 服務器。

**主要功能**：

- `createServerAxios`: 創建服務器端 Axios 實例
- `httpProxy`: 處理請求代理並轉換響應
- 錯誤處理和令牌過期處理

#### `proxy` 使用範例

```ts
export async function GET(request: NextRequest) {
  return proxy(request);
}
```

```ts
export async function GET(request: NextRequest) {
  return proxyMiddleware(request, {
    rewrite: () => ({
      target: 'https://api-server.com',
      changeOrigin: true,
      path: request.nextUrl.pathname.replace(/\/api/, '')
    })
  });
}
```

### 4. 公共工具函數 (common.ts)

提供各種工具函數，用於請求和響應的轉換。

**主要功能**：

- `requestToAxiosRequestConfig`: 將 Next.js 請求轉換為 Axios 配置
- `axiosResponseToFetchResponse`: 將 Axios 響應轉換為 Next.js 響應
- `flattenAxiosConfigHeaders`: 處理 Axios 頭部扁平化
- `getReferer`: 獲取請求來源

## 身份驗證機制

系統實現了多層次的身份驗證機制：

1. **Cookie 和 Header 令牌提取**:
   - 從 HTTP 頭部或 Cookie 中獲取 `access_token`
   - 自動將令牌添加到傳出請求中

2. **令牌過期處理**:
   - 檢測 401 錯誤和令牌過期消息
   - 觸發令牌刷新流程
   - 清除 query client 緩存（如果刷新失敗）

3. **路由保護**:
   - 中間件檢查特定路由的身份驗證
   - 未授權用戶重定向到登錄頁面

## 使用案例

### 1. 客戶端 API 調用

```ts
// 在前端組件中
import { http } from '@/shared/http';

async function fetchUsers() {
  const response = await http().request({
    method: 'GET',
    url: '/api/users',
  });
  return response.data;
}
```

### 2. 創建 API 路由處理程序

```ts
// app/api/example/route.ts
import { NextRequest } from 'next/server';
import { proxyMiddleware } from '@/libs/http/server';

export async function GET(req: NextRequest) {
  return proxyMiddleware(req, {
    rewrite: (req) => ({
      target: process.env.API_SERVER_URL,
      changeOrigin: true,
      path: '/example-endpoint'
    }),
  });
}
```

### 3. 直接在 Next.js API 路由中使用

```ts
// app/api/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requestToAxiosRequestConfig, axiosResponseToFetchResponse } from '@/libs/http/common';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const config = await requestToAxiosRequestConfig(req);
  config.url = 'https://api.example.com/data';
  
  try {
    const response = await axios.request(config);
    return axiosResponseToFetchResponse(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
```

## 最佳實踐與建議

1. **使用類型安全的 API 客戶端**:
   - 利用 Zod 模式進行請求和響應驗證
   - 在開發環境中啟用驗證，捕獲潛在問題

2. **正確處理身份驗證**:
   - 確保敏感路由在中間件中受到保護
   - 實現適當的令牌刷新邏輯

3. **管理錯誤處理**:
   - 適當處理 API 錯誤
   - 為用戶提供有意義的錯誤消息

4. **優化性能**:
   - 使用查詢客戶端進行緩存
   - 避免不必要的代理轉發

## 常數

系統的行為可以通過多種配置選項進行調整：

- **API_SERVER_URL**: 後端 API 服務器的基本 URL
- **IS_DEV**: 控制開發環境特定功能，如模式驗證
- **IS_SERVER**: 區分服務器端和客戶端代碼路徑

## Middleware Flow

```mermaid
flowchart TD
    A[接收客戶端請求] --> B{檢查路徑}
    
    B -->|/api/*| C[HTTP 代理處理]
    B -->|特定登入專用頁面| D{身份驗證檢查}
    B -->|ALLOWED_API_PATHS 允許的路徑或其他路徑| E[Next.js 正常處理]
    
    C --> F[轉換 Next 請求為 Axios 配置]
    F --> G[重寫請求路徑]
    G --> H[附加授權標頭]
    H --> I[發送到 API 服務器]
    I --> J[接收 API 響應]
    J --> K[轉換 Axios 響應為 Next 響應]
    K --> L[返回給客戶端]
    
    D -->|有效令牌| E
    D -->|無效令牌| M[重定向到首頁]
    
    subgraph 錯誤處理
    N[捕獲請求錯誤]
    O{錯誤類型?}
    O -->|401 Token expired| P[觸發令牌刷新]
    O -->|其他錯誤| Q[轉換為 Next 錯誤響應]
    P -->|成功| R[重試原始請求]
    P -->|失敗| S[清除查詢客戶端]
    end
    
    I -.-> N
    N --> O
    
    style A fill:#d4f1f9,stroke:#0099cc,color:#003366
    style B fill:#ffe6cc,stroke:#d79b00,color:#003366
    style C fill:#d5e8d4,stroke:#82b366,color:#003366
    style D fill:#ffe6cc,stroke:#d79b00,color:#003366
    style M fill:#f8cecc,stroke:#b85450,color:#003366
    style P fill:#fff2cc,stroke:#d6b656,color:#003366
    style S fill:#f8cecc,stroke:#b85450,color:#003366
```
