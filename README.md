# Comunidade Viva Web

Aplicação web (SPA + PWA) da Comunidade Viva: site público, portal do Wi-Fi de visitantes e área
de membros autenticada.

As regras de arquitetura, código e design estão em [`CLAUDE.md`](CLAUDE.md) (mesmo conteúdo em
[`AGENTS.md`](AGENTS.md)). Leia antes de alterar o projeto.

## Stack

React 19 + React Compiler, TypeScript, Vite 8, TanStack Router (rotas por arquivo), TanStack
Query, Zustand, React Hook Form + Zod, Ky, Tailwind CSS 4 + shadcn/ui (Base UI), i18next (pt-BR e
en-US), Vitest + Testing Library, Playwright, Oxlint + Oxfmt. Hospedagem em Cloudflare Workers +
Static Assets.

Arquitetura feature-first com DDD + MVVM (`src/features/<feature>/{domain,application,infrastructure,presentation}`).

## Requisitos

- Node.js `24.21.0`
- pnpm `12.6.0`

## Primeiros passos

```bash
pnpm install
cp .env.example .env.development
pnpm dev
```

A aplicação abre em `http://localhost:5173`.

## Variáveis de ambiente

| Variável           | Onde               | Uso                                                                  |
| ------------------ | ------------------ | -------------------------------------------------------------------- |
| `VITE_ENV`         | `.env.*`           | Ambiente (`development`, `homologation`, `staging`, `production`).   |
| `BFF_PROXY_TARGET` | `.env.development` | Somente no dev: destino do proxy do Vite para `/auth/*` (BFF local). |

Variáveis `VITE_*` vão para o bundle: nunca coloque segredos nelas.

Secrets do Worker (`pnpm exec wrangler secret put <NOME>`; localmente em `.dev.vars`, modelo em
`.dev.vars.example`): `OMADA_*` (Wi-Fi de visitantes) e `BFF_ORIGIN` (origem do BFF).

## Autenticação

O login usa o BFF (`comunidadevivati/backend`) com OIDC Authorization Code + PKCE no Keycloak. O
front não recebe credenciais nem tokens: a sessão é um cookie HttpOnly emitido pelo BFF.

```text
Navegador ──/auth/*──▶ Worker (produção) ou proxy do Vite (dev) ──▶ BFF ──▶ Keycloak
```

As rotas `/auth/*` passam pela mesma origem do front, então o cookie `SameSite=Lax` funciona sem
CORS. O front usa:

- `GET /auth/me`: sessão atual (401 = sem sessão), com o token CSRF mantido só em memória;
- `GET /auth/login`: navegação para iniciar o login;
- `POST /auth/logout`: encerra a sessão, com o header `X-CSRF-Token`.

### Rodar com o BFF local

1. Suba Keycloak, Redis e o BFF no repositório do backend.
2. No BFF, use a origem do front nas URLs: `BFF_BASE_URL=http://localhost:5173`,
   `WEB_BASE_URL=http://localhost:5173` e `BFF_OIDC_CALLBACK_URL=http://localhost:5173/auth/callback`.
3. No Keycloak, cadastre `http://localhost:5173/auth/callback` nas redirect URIs do client do BFF.
4. Rode `pnpm dev` (o proxy aponta para `http://localhost:3000`, ou para `BFF_PROXY_TARGET`).

## Scripts

| Comando              | O que faz                                                         |
| -------------------- | ----------------------------------------------------------------- |
| `pnpm dev`           | Servidor de desenvolvimento                                       |
| `pnpm build`         | Typecheck e build de produção (com service worker)                |
| `pnpm preview`       | Serve o build localmente                                          |
| `pnpm quality:fix`   | Corrige lint e formatação e valida lint, formatação e tipos       |
| `pnpm quality:check` | Só valida lint, formatação e tipos                                |
| `pnpm test:run`      | Testes unitários e de componente (Vitest)                         |
| `pnpm test:coverage` | Testes com cobertura (falha abaixo dos limites mínimos definidos) |
| `pnpm test:e2e`      | Testes end-to-end (Playwright, Chromium, em pt-BR)                |

## Deploy

Cloudflare Workers + Static Assets (`wrangler.jsonc`). O Worker (`worker/index.ts`) só executa em
`/api/*` (Wi-Fi de visitantes) e `/auth/*` (proxy para o BFF); o restante é servido como asset
estático, com fallback de SPA.

Produção: <https://comunidade-viva-web.comvivati.workers.dev>
