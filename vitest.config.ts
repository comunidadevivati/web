import { fileURLToPath, URL } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@worker': fileURLToPath(new URL('./worker', import.meta.url)),
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      // Mede todo o código da aplicação e do Worker, não só os arquivos importados pelos testes.
      include: ['src/**/*.{ts,tsx}', 'worker/**/*.ts'],
      exclude: [
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        'src/app/router/routeTree.gen.ts',
        // Depende do módulo virtual do vite-plugin-pwa, que não existe no ambiente de testes.
        'src/app/pwa/**',
        'src/main.tsx',
        'src/test/**',
      ],
      // Piso contra regressão, a partir da medição real (2026-10-14). Subir conforme novos testes.
      thresholds: {
        statements: 34,
        branches: 25,
        functions: 20,
        lines: 34,
      },
    },
  },
});
