/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: 'development' | 'homologation' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
