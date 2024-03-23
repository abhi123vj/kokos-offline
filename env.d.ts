/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_PORT0: string
  readonly MAIN_VITE_PORT1: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
