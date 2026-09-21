/// <reference types="vite/client" />

// highlight.js 的单语言子路径没有随包提供类型声明，这里补一个通配声明
declare module 'highlight.js/lib/languages/*' {
  import type { LanguageFn } from 'highlight.js'
  const language: LanguageFn
  export default language
}

interface ImportMetaEnv {
  readonly VITE_GIT_COMMIT_SHA: string
  readonly VITE_POCKETBASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
