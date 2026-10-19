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

| Arquivo             | Versionado | Uso                                                                 |
| ------------------- | ---------- | ------------------------------------------------------------------- |
| `.env.local`        | não        | Desenvolvimento local (`pnpm dev`); crie a partir do `.env.example` |
| `.env.homologation` | sim        | Build de homologação (`pnpm build:homologation`)                    |
| `.env.production`   | sim        | Build de produção (`pnpm build` ou `pnpm build:production`)         |

| Variável           | Onde         | Uso                                                                                    |
| ------------------ | ------------ | -------------------------------------------------------------------------------------- |
| `VITE_ENV`         | todos        | Ambiente (`development`, `homologation`, `production`).                                |
| `BFF_PROXY_TARGET` | `.env.local` | Somente no dev: destino do proxy do Vite para `/auth/*` e `/api/v1/*` (BFF local/HML). |

Variáveis `VITE_*` vão para o bundle: nunca coloque segredos nelas. Os arquivos versionados contêm
só valores públicos, porque o Workers Builds compila a partir do Git.

Secrets do Worker (`pnpm exec wrangler secret put <NOME>`; localmente em `.dev.vars`, modelo em
`.dev.vars.example`): `OMADA_*` (Wi-Fi de visitantes) e `BFF_ORIGIN` (origem do BFF).

## Autenticação

O login é por e-mail e senha no BFF (`comunidadevivati/backend`). O front envia as credenciais ao
BFF e não guarda nada: a sessão é um cookie HttpOnly emitido pelo BFF.

```text
Navegador ──/auth/* e /api/v1/*──▶ Worker (produção) ou proxy do Vite (dev) ──▶ BFF
```

As rotas `/auth/*` e `/api/v1/*` passam pela mesma origem do front, então o cookie `SameSite=Lax` funciona sem
CORS. O front usa:

- `POST /auth/login`: `{ email, password }`; sucesso grava o cookie (401 = credenciais inválidas,
  429 = limite de tentativas);
- `POST /auth/password-recovery`: `{ email }`; solicita a recuperação com resposta neutra, sem
  revelar se a conta existe;
- `POST /auth/password-reset`: `{ token, password }`; redefine a senha a partir do link recebido,
  encerra as sessões existentes e abre uma nova (o front segue para o dashboard com um toast);
- `POST /auth/email-verification`: `{ token }`; confirma o e-mail pelo link (rota `/verify-email`);
- `POST /auth/email-verification/resend`: reenvia o link para o e-mail da sessão, com o header
  `X-CSRF-Token`;
- `GET /auth/me`: sessão atual com `user.emailVerified` (401 = sem sessão), com o token CSRF mantido só em memória;

Conta com `emailVerified: false` mostra o badge "Não verificado" e a opção de reenvio no menu da
conta, e só o menu Dashboard, que exibe apenas o aviso de conta não verificada. Itens futuros do
menu lateral podem usar `requiresVerifiedEmail` para ficar ocultos até a verificação.

- `POST /auth/logout`: encerra a sessão, com o header `X-CSRF-Token`.

### Rodar com o BFF local

1. Suba o BFF no repositório do backend, com `BFF_BASE_URL` e `WEB_BASE_URL` apontando para
   `http://localhost:5173`.
2. Rode `pnpm dev` (o proxy aponta para `http://localhost:3000`, ou para `BFF_PROXY_TARGET`).

### Rodar com o BFF de homologação

Sem subir o backend local, defina no `.env.local`
`BFF_PROXY_TARGET=https://comvivati-bff-hml.onrender.com` e rode `pnpm dev`. O login usa os dados de
HML e o cookie de sessão fica em `localhost`. O primeiro acesso pode demorar (cold start do Render).

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
`/api/*` (Wi-Fi de visitantes; `/api/v1/*` é proxy para o BFF) e `/auth/*` (proxy para o BFF); o restante é servido como asset
estático, com fallback de SPA.

| Ambiente    | Branch         | Worker                    | Domínio                            | Deploy (Workers Builds)                                 |
| ----------- | -------------- | ------------------------- | ---------------------------------- | ------------------------------------------------------- |
| Produção    | `main`         | `comunidade-viva-web`     | `https://comvivaeficaz.com.br`     | `pnpm build` + `wrangler deploy`                        |
| Homologação | `homologation` | `comunidade-viva-web-hml` | `https://hml.comvivaeficaz.com.br` | `pnpm build:homologation` + `wrangler deploy --env hml` |

Cada Worker tem os próprios secrets (`BFF_ORIGIN` apontando para o BFF do mesmo ambiente). Não há
ambiente de desenvolvimento publicado: o desenvolvimento é local, com BFF local ou de HML.

Os dois Workers estão ligados ao repositório pelo Workers Builds: cada merge em `main` publica
produção e cada merge em `homologation` publica HML. Os builds de prévia de outras branches ficam
desligados, para que nenhuma branch rode com os secrets de um ambiente publicado.

Nenhum commit ou push direto em `main` ou `homologation`: as alterações entram em `homologation`
por PR aprovado, e a `main` só recebe PRs da `homologation`.
