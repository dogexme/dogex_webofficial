/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly proxy: string
  readonly BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
