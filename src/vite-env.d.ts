/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FEATURE_HERO_V2: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
