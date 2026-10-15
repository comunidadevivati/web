/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: 'development' | 'homologation' | 'staging' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
