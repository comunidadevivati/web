# AGENTS.md — Comunidade Viva Web

> Guia operacional e arquitetural obrigatório para agentes de IA e desenvolvedores que alterarem este repositório.
>
> Última consolidação: 2026-10-07.
>
> Este documento descreve as decisões já adotadas no projeto, as regras que devem ser preservadas e o modo esperado de implementar novas funcionalidades.

---

## 1. Objetivo deste arquivo

Este arquivo é a fonte de contexto e instruções do repositório para agentes de código, especialmente ChatGPT/Codex.

Antes de criar, alterar, mover ou excluir arquivos, leia este documento inteiro e preserve todas as regras descritas aqui, salvo quando uma solicitação explícita do responsável pelo projeto determinar uma mudança.

Quando existirem outros arquivos `AGENTS.md` em subpastas, considere também as instruções mais específicas do diretório em que o arquivo alterado está localizado.

Prioridades, em ordem:

1. Correção funcional.
2. Respeito à arquitetura MVVM + DDD.
3. Consistência com os padrões existentes.
4. Tipagem forte e validação em tempo de compilação.
5. Acessibilidade.
6. Qualidade e legibilidade.
7. Performance.
8. Experiência visual consistente com a identidade Comunidade Viva.

Não introduza uma nova biblioteca, padrão arquitetural ou ferramenta apenas por preferência pessoal.

---

## 2. Projeto

- Nome: **Comunidade Viva Web**.
- Pacote: `@comunidade-viva/web`.
- Repositório: `comunidadevivati/web`.
- Branch principal atual: `main`.
- Aplicação: SPA + PWA.
- Idioma principal da interface: `pt-BR`.
- Diretório local utilizado no desenvolvimento: `~/Documents/projects/viva/web`.
- Remote SSH utilizado no ambiente do projeto: `git@github-comunidadeviva:comunidadevivati/web.git`.

### Filosofia do produto

A aplicação deve transmitir uma identidade:

- moderna;
- profissional;
- corporativa;
- séria;
- tecnológica;
- futurista;
- limpa;
- acessível;
- sem aparência exageradamente gamer ou neon.

A interface deve usar a identidade visual da Comunidade Viva como base e evitar componentes genéricos sem refinamento visual quando a tela já possuir direção de design definida.

---

## 3. Stack oficial

Versões atuais de referência do projeto:

| Tecnologia      | Versão / linha atual |
| --------------- | -------------------- |
| Node.js         | `24.21.0`            |
| pnpm            | `12.6.0`             |
| React           | `19.3.x`             |
| React DOM       | `19.3.x`             |
| TypeScript      | `6.0.x`              |
| Vite            | `8.3.x`              |
| React Compiler  | habilitado           |
| TanStack Router | `1.170.x`            |
| TanStack Query  | `5.104.x`            |
| Zustand         | `5.x`                |
| Ky              | `2.x`                |
| React Hook Form | `7.89.x`             |
| Zod             | `4.6.x`              |
| Tailwind CSS    | `4.3.x`              |
| shadcn/ui       | `4.21.x`             |
| Base UI         | `1.8.x`              |
| Lucide React    | `1.51.x`             |
| Vitest          | `5.x`                |
| Testing Library | `16.x`               |
| Playwright      | `1.63.x`             |
| Oxlint          | `1.86.x`             |
| Oxfmt           | `0.71.x`             |
| vite-plugin-pwa | `1.3.x`              |
| Workbox         | `7.4.x`              |
| Wrangler        | `4.147.x`            |

### Restrições de versão

- Não migrar TypeScript para uma major incompatível sem validar todos os peers.
- Não trocar pnpm por npm, yarn ou bun.
- Não trocar Oxlint/Oxfmt por ESLint/Prettier.
- Não remover React Compiler sem motivo técnico comprovado.
- Não substituir TanStack Router por React Router.
- Não substituir Ky por Axios no novo projeto.

### Supply-chain

O `pnpm-workspace.yaml` permite scripts de build somente para dependências explicitamente aprovadas:

```yaml
allowBuilds:
  esbuild: true
  workerd: true
```

Não amplie esta lista sem necessidade real e revisão.

---

## 4. Arquitetura macro

O projeto usa **DDD + MVVM + feature-first**.

Estrutura conceitual:

```text
src/
├── app/
│   ├── config/
│   ├── layouts/
│   ├── providers/
│   ├── pwa/
│   ├── router/
│   └── store/
├── assets/
├── components/
│   ├── ui/
│   ├── molecules/
│   └── organisms/
├── features/
│   └── <feature>/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── lib/
├── shared/
└── test/
```

### Responsabilidades

#### `domain/`

Contém regras e contratos de negócio independentes de UI e infraestrutura.

Pode conter:

- entidades;
- value objects;
- tipos de domínio;
- contratos de repositório;
- regras puras de negócio.

Não deve depender de React, TanStack Router, localStorage, HTTP, shadcn ou qualquer detalhe de infraestrutura.

#### `application/`

Orquestra casos de uso.

Pode conter:

- use cases;
- DTOs de entrada/saída;
- serviços de aplicação;
- portas/interfaces necessárias ao fluxo.

Nomenclatura preferida para casos de uso:

```text
nome.use-case.ts
```

Exemplo:

```text
application/use-cases/login.use-case.ts
```

#### `infrastructure/`

Contém implementações concretas e integração com recursos externos.

Exemplos:

- HTTP;
- APIs;
- BFF;
- localStorage;
- IndexedDB;
- implementações de repositories;
- adapters.

Exemplo atual:

```text
infrastructure/storage/auth-user.storage.ts
```

#### `presentation/`

Contém MVVM e componentes específicos da feature.

Estrutura preferida:

```text
presentation/
├── components/
├── models/
├── view-models/
└── views/
```

---

## 5. Padrão MVVM obrigatório

Arquivos que representam partes do MVVM devem possuir sufixos explícitos.

### View

```text
nome.view.tsx
```

Exemplos:

```text
login.view.tsx
home.view.tsx
authenticated-layout.view.tsx
```

Responsabilidades:

- renderização;
- composição visual;
- binding com o ViewModel;
- eventos delegados ao ViewModel;
- nenhuma regra de domínio;
- nenhuma chamada HTTP direta;
- nenhum acesso direto à infraestrutura quando o fluxo puder ser delegado.

### ViewModel

```text
nome.view-model.ts
```

Exemplos:

```text
login.view-model.ts
authenticated-layout.view-model.ts
home.view-model.ts
```

Responsabilidades:

- estado da View;
- ações da View;
- transformação de dados para apresentação;
- integração com casos de uso;
- navegação quando fizer parte do fluxo de UI;
- controle de loading, disabled, visibilidade e estados equivalentes.

### Model da camada de apresentação

```text
nome.model.ts
```

Exemplos:

```text
login.model.ts
home.model.ts
authenticated-layout.model.ts
```

Responsabilidades:

- tipos consumidos pela View/ViewModel;
- schemas Zod da apresentação quando forem específicos do formulário;
- enums/unions de estado visual.

### Componentes auxiliares

Componentes auxiliares que **não** são uma View MVVM completa não recebem `.view`.

Correto:

```text
password-field.tsx
login-header.tsx
brand-panel.tsx
```

Evitar:

```text
login-form.view.tsx
```

quando `login.view.tsx` já representa a View principal do fluxo.

### Exemplo de feature

```text
src/features/auth/
├── domain/
│   └── auth-user.ts
├── application/
│   └── use-cases/
│       └── login.use-case.ts
├── infrastructure/
│   └── storage/
│       └── auth-user.storage.ts
└── presentation/
    ├── models/
    │   └── login.model.ts
    ├── view-models/
    │   └── login.view-model.ts
    └── views/
        └── login.view.tsx
```

---

## 6. Dependências entre camadas

Direção conceitual preferida:

```text
Presentation
    ↓
Application
    ↓
Domain

Infrastructure → implementa portas/contratos necessários
```

Regras:

- View não conhece endpoint.
- View não instancia cliente HTTP.
- View não deve gravar diretamente em localStorage.
- ViewModel não deve conhecer detalhes de Ky/HTTP quando existir um caso de uso apropriado.
- Domain não importa infraestrutura.
- Domain não importa React.
- Dados de servidor pertencem ao TanStack Query, não ao Zustand.

### Exceção temporária conhecida

O fluxo atual de autenticação é propositalmente simplificado para permitir navegação funcional antes da API real.

Atualmente:

```text
LoginView
   ↓
LoginViewModel
   ↓
loginUseCase
   ↓
auth-user.storage
   ↓
localStorage
```

No futuro, a persistência local temporária deverá ser substituída pela autenticação real via backend/BFF e por abstrações adequadas de repositório/sessão.

Não interprete o `localStorage` atual como mecanismo de segurança.

---

## 7. Regras de código obrigatórias

### 7.1 Funções

Usar **arrow functions**.

Correto:

```ts
export const getUser = () => {
  return user;
};
```

Incorreto:

```ts
export function getUser() {
  return user;
}
```

### 7.2 Exports

Sempre exportar diretamente na declaração.

Correto:

```ts
export const LoginView = () => {};

export type LoginFormData = {};

export interface UserRepository {}
```

Incorreto:

```ts
const LoginView = () => {};

export { LoginView };
```

### 7.3 Default export

Não usar `export default` no código da aplicação.

Exceções atuais de tooling:

- `vite.config.ts`;
- `vitest.config.ts`;
- `playwright.config.ts`.

### 7.4 Props

Para props de componentes React, preferir `type`.

```ts
type UserCardProps = {
  name: string;
};
```

Reservar `interface` principalmente para contratos extensíveis de domínio, serviços e repositories quando extensão semântica fizer sentido.

### 7.5 Semicolons

Obrigatórios.

### 7.6 Indentação

- 2 espaços.
- Nada de tabs em TS/TSX.

### 7.7 Largura

- 100 colunas como referência.

### 7.8 Linhas em branco

O projeto possui regra incomum e intencional:

- uma linha em branco entre statements;
- imports permanecem agrupados sem linhas em branco;
- no máximo uma linha vazia consecutiva.

Deixe Oxfmt/Oxlint aplicar o padrão.

### 7.9 Fim de arquivo

- sempre newline no EOF;
- LF no repositório;
- `.bat` e `.cmd` usam CRLF.

### 7.10 Variáveis não usadas

Não deixar variáveis, imports ou parâmetros não utilizados.

Quando um argumento precisa existir por contrato mas é intencionalmente não usado, prefixar `_`.

```ts
const execute = (_context: Context) => {};
```

### 7.11 Igualdade e blocos

- usar igualdade estrita;
- blocos com chaves;
- `const` sempre que possível;
- nunca `var`.

### 7.12 Desestruturação (regra obrigatória)

Sempre usar desestruturação em imports, retornos de hooks e objetos consumidos.

**Imports de componentes:** um único import por grupo, pelo barrel (`index.ts`) do grupo.

Correto:

```ts
import { Box, Button, Heading, Image, Text } from '@/components/ui';
import { ThemeToggle, TooltipHint } from '@/components/molecules';
import { AppSidebar } from '@/components/organisms';
```

Evitar:

```ts
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
```

- cada grupo (`ui`, `molecules`, `organisms`) tem um `index.ts` com `export * from '...'` de cada componente; ao criar um componente, adicioná-lo ao barrel do grupo;
- dentro do próprio grupo, importar o arquivo direto (ex.: uma molécula importando outra usa `@/components/molecules/tooltip-hint/tooltip-hint`) para evitar import circular pelo barrel.

**Hooks e objetos:** desestruturar o que for usado.

```ts
const { error, isError, isPending, mutate, reset } = useMutation({ ... });

const { preference, setPreference } = useThemeStore();

const { history } = useRouter();

const {
  formState: { isDirty, isValid },
  handleSubmit,
  register,
} = form;
```

Exceções: hooks que retornam uma função ou valor único (`const navigate = useNavigate();`) e objetos repassados inteiros adiante (ex.: `form` entregue à View).

---

## 8. Imports

### Alias

Importações manuais de código da aplicação usam `@/`.

Correto:

```ts
import { Button } from '@/components/ui/button';
```

Incorreto:

```ts
import { Button } from '../../../components/ui/button';
```

O lint bloqueia padrões relativos `./**` e `../**`.

### Organização

- imports em um único bloco;
- ordem alfabética;
- sem linhas em branco entre imports;
- Oxfmt/Oxlint são responsáveis pela ordenação final.

### Imports de tipo

Usar `type` quando apropriado.

```ts
import type { AuthUser } from '@/features/auth/domain/auth-user';
```

---

## 9. HTML nativo e composição de UI

Regra arquitetural importante:

**Pages, Views, layouts e componentes de composição não devem usar tags HTML nativas diretamente.**

O lint `project/no-native-jsx-elements` existe para reforçar essa regra nas camadas configuradas.

### Onde HTML nativo é permitido

Em `src/components/ui/**`.

Essa camada encapsula primitivas como:

- `Box` → `div`;
- `Text` → `p`;
- `Form` → `form`;
- `Image` → `img`;
- `Heading` → `h1` ... `h6`;
- componentes shadcn/Base UI.

### Exemplo

Preferir:

```tsx
<Box className="grid gap-4">
  <Heading>Dashboard</Heading>
  <Text>Visão geral.</Text>
</Box>
```

Evitar na View:

```tsx
<div>
  <h1>Dashboard</h1>
  <p>Visão geral.</p>
</div>
```

### Componentes shadcn gerados

O código produzido pelo CLI do shadcn **não deve ser aceito cegamente**.

Após adicionar um componente, revisar e adaptar para:

- arrow functions;
- exports diretos;
- semicolons;
- aspas e formatação do Oxfmt;
- tipagem padrão do projeto;
- regras de Fast Refresh;
- lint do projeto.

Sempre executar:

```bash
pnpm quality:fix
```

após geração.

---

## 10. UI, Tailwind e shadcn

### Stack visual

- Tailwind CSS v4.
- shadcn/ui.
- Base UI.
- Lucide para ícones.
- Roboto (`@fontsource-variable/roboto`, auto-hospedada) como fonte oficial: todos os pesos, larguras e itálico.
- Tipografia padrão em `body`: Roboto Regular, peso 400, `1rem`, `line-height: 1`.

### Variantes

Quando um componente tiver variantes de classe reutilizáveis, preferir `cva`.

Isso também mantém melhor integração com Tailwind IntelliSense.

### Onde escrever as classes (regra obrigatória)

Classes do Tailwind precisam estar sempre em um lugar que o Tailwind IntelliSense reconhece (autocomplete, hover e validação no VS Code):

1. **Preferencial:** direto na prop `className`.
2. **Variantes reutilizáveis:** `cva(...)`.
3. **Classes condicionais, combinadas ou guardadas em variáveis/objetos:** sempre dentro de `cn(...)`.

Nunca guardar classes em string ou template literal solto.

Correto:

```tsx
<Link className="inline-flex h-11 items-center gap-2 rounded-lg px-4" to="/login" />;

const cardClassName = cn('grid gap-5 rounded-2xl bg-card p-5');

const layoutColumns = {
  collapsed: cn('md:grid-cols-[4.5rem_minmax(0,1fr)]'),
};

<Box className={cn('absolute top-0 left-0 h-1 w-full', styles.accent)} />;
```

Evitar:

```tsx
const loginClassName = `
  mt-2 inline-flex h-11 items-center ...
`;

const layoutColumns = { collapsed: 'md:grid-cols-[4.5rem_minmax(0,1fr)]' };

<Box className={`absolute top-0 left-0 h-1 w-full ${styles.accent}`} />;
```

Classes usadas uma única vez ficam no `className` do próprio elemento. Variável só se justifica quando a mesma lista é reutilizada.

### Quebra de linha das classes

Listas de classes que passam de 100 colunas são quebradas automaticamente em várias linhas pela regra `better-tailwindcss/enforce-consistent-line-wrapping` (Oxlint + `eslint-plugin-better-tailwindcss`). Vale para `className`, `cn(...)`, `cva(...)` (incluindo `variants`) e variáveis `*ClassName`. Não quebrar manualmente; rodar `pnpm quality:fix` (a primeira execução pode precisar de uma segunda para estabilizar a indentação).

### Cores e tokens de design

**Nunca usar valores de cor fixos/chumbados em componentes.** A aplicação terá modo claro, modo escuro e temas futuros; toda cor deve vir de um token semântico.

Proibido em `src/**/*.{ts,tsx}`:

- hex em classes arbitrárias: `bg-[#081519]`, `text-[#65e3e8]`, `shadow-[inset_3px_0_0_#16b3bb]`;
- funções de cor literais: `rgb()`, `rgba()`, `hsl()`, `oklch()` etc.;
- paleta padrão do Tailwind: `bg-white`, `text-black`, `text-slate-500`, `bg-cyan-500/10` etc.;
- cores em `style={{ ... }}`.

A regra de lint `project/no-hardcoded-colors` bloqueia esses padrões em `src/`.

#### Onde os tokens vivem

Todos os tokens ficam em `src/index.css`, arquivo usado pelo Tailwind v4 e pelo shadcn (`components.json`). Estrutura em três camadas:

1. **Paleta da marca** (`--viva-*` em `:root`): valores brutos. Nunca usados diretamente em componentes.
2. **Tokens semânticos** (`:root` = modo claro, `.dark` = modo escuro): descrevem o papel da cor (`--background`, `--header`, `--sidebar`, `--primary`...) e referenciam a paleta. É aqui que os modos mudam valores.
3. **`@theme inline`**: expõe cada token semântico como utilitário Tailwind (`--color-header: var(--header)` → `bg-header`, `text-header`, `border-header`...).

Novos temas devem ser criados redefinindo apenas a camada semântica (ex.: um seletor `.theme-x` ou `[data-theme='x']`), sem alterar componentes.

#### Paleta da marca

A paleta é **somente Teal**: a escala oficial do Tailwind CSS (https://tailwindcss.com/docs/colors), com o **Teal 500** como cor de referência da marca. A escala completa (`--viva-teal-50` … `--viva-teal-950`) usa os mesmos valores OKLCH do Tailwind.

Além dela existem apenas `--viva-white`, `--viva-black` e as cores oficiais de marcas de terceiros (`--brand-*`, redes sociais). Não reintroduzir outras famílias de cor sem decisão explícita.

#### Tokens disponíveis

| Token                                                                                                                                                                         | Uso                                                                          | Claro              | Escuro              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------ | ------------------- |
| `background` / `foreground`                                                                                                                                                   | fundo de todas as páginas e texto sobre ele                                  | teal-100 / 950     | teal-800 / 50       |
| `card` / `card-foreground`                                                                                                                                                    | cards, formulários e painéis sobre o fundo (via `surface-card`)              | teal-100 / 950     | teal-950 a 80% / 50 |
| `muted` / `muted-foreground`                                                                                                                                                  | superfícies sutis e texto secundário (sobre `background` e `card`)           | teal-50 / 800      | teal-950 / 200      |
| `secondary` / `secondary-foreground`                                                                                                                                          | botões e superfícies secundárias                                             | teal-100 / 950     | teal-700 / 50       |
| `border`, `input`, `ring`                                                                                                                                                     | bordas, campos e foco                                                        | teal-300/300/600   | teal-700/700/300    |
| `destructive`                                                                                                                                                                 | erros e ações destrutivas                                                    | vermelho           | vermelho            |
| `primary` / `primary-foreground`                                                                                                                                              | cor da marca (Teal 500) e texto sobre ela                                    | teal-500 / 950     | teal-500 / 950      |
| `primary-strong`                                                                                                                                                              | texto/ícone da marca sobre `background` e `card` (eyebrows, links, destaque) | teal-800           | teal-200            |
| `brand-gradient-start`, `brand-gradient-middle`, `brand-gradient-end`, `brand-foreground`                                                                                     | painel de marca com gradiente (login) e texto sobre ele                      | teal-600→800→950   | igual               |
| `header`, `header-foreground`, `header-border`, `header-accent`, `header-accent-foreground`                                                                                   | headers (público, autenticado e Wi-Fi), iguais nos dois modos                | teal-950 / white   | igual               |
| `sidebar`, `sidebar-foreground`, `sidebar-muted-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border` | menu lateral do app autenticado                                              | teal-400 / 950     | teal-900 / white    |
| `overlay`, `overlay-foreground`                                                                                                                                               | camadas sobre fotos/mídia (carrossel) e base das sombras                     | black / white      | igual               |
| `chart-1` … `chart-4`                                                                                                                                                         | cores categóricas de indicadores e gráficos                                  | ajustadas por modo | ajustadas por modo  |
| `social-*`                                                                                                                                                                    | identidade oficial das redes sociais                                         | igual              | igual               |

**Superfície de card:** cards usam o utilitário `surface-card` (definido com `@utility` no `src/index.css`) em vez de `bg-card`. Ele aplica o fundo do card e reescopa os tokens de conteúdo (`foreground`, `muted`, `muted-foreground`, `primary`, `primary-foreground`, `primary-strong`, `border`, `input`, `ring`) para os valores `--card-*`, mantendo o contraste de tudo que está dentro do card nos dois modos. Componentes dentro do card continuam usando os utilitários de sempre (`text-muted-foreground`, `bg-primary`...).

**Header e footer:** o `AppFooter` usa os mesmos tokens `header-*` e a mesma altura do header (`h-16 md:h-18`), fica fixo no rodapé (`sticky bottom-0`) e aparece em todas as telas com header. Páginas com header/footer fixos usam `overflow-x-clip` (não `overflow-x-hidden`, que quebra o `sticky`).

Sombras com cor também são tokens (`@theme inline`): `shadow-elevated`, `shadow-elevated-lg`, `shadow-sidebar-active`.

#### Regras de uso

- usar sempre o utilitário semântico (`bg-background`, `text-primary-strong`, `border-border`);
- texto da marca sobre o fundo ou sobre cards usa `text-primary-strong`, nunca `text-primary` (contraste insuficiente);
- tokens `header-*` só dentro de headers; tokens `sidebar-*` só dentro do menu lateral;
- transparência via modificador de opacidade sobre o token (`bg-primary/10`, `text-header-foreground/75`) é permitida;
- precisa de uma cor nova? Adicionar primeiro na paleta (`--viva-*`), depois criar o token semântico em `:root` **e** revisar o `.dark`, e expor em `@theme inline`;
- não criar tokens semânticos com nome de cor (`--teal`); nomear pelo papel (`--primary-strong`);
- não usar o variant `dark:` em Views para trocar cores: o modo escuro é resolvido pelos tokens. `dark:` fica restrito a ajustes finos em `src/components/ui/**`;
- exceções fora de `src/` (ex.: `theme_color` do manifesto PWA em `vite.config.ts` e a meta `theme-color` do `index.html`, ambos teal-950 `#022f2e`) não são componentes e podem usar valor literal.

### Tema claro / escuro

O tema é **global**: vale para todas as páginas (públicas, Wi-Fi de visitantes, login e área autenticada).

- preferências: `system` (padrão, segue o sistema operacional), `light` e `dark`;
- a preferência fica salva no aparelho (Zustand `persist`, chave `@comunidade-viva:web:theme`) em `src/app/theme/theme.store.ts`;
- o `ThemeProvider` (`src/app/providers/theme-provider.tsx`, montado no `main.tsx`) usa `useThemeSync`, que aplica a classe `.dark` no `<html>` com `useLayoutEffect` (antes da primeira pintura) e acompanha a troca de tema do sistema enquanto a preferência for `system`;
- o store hidrata a preferência do `localStorage` de forma síncrona, então o primeiro render já usa o tema certo;
- não aplicar o tema com scripts inline no `index.html` nem com manipulação de DOM fora do React;
- o controle de troca é o componente `ThemeToggle` (`src/components/molecules/theme-toggle`), com os tons `header` e `sidebar`. Hoje ele aparece no header público (inclusive no menu mobile) e no rodapé da sidebar.

Toda tela nova deve ser validada nos dois modos.

### Direção de design

Todas as telas devem manter:

- header teal-950 premium, igual nos dois modos;
- menu lateral em teal vivo no claro (teal-400) e, no escuro, teal-900: entre o header (teal-950) e o fundo do conteúdo (teal-800);
- fundo das páginas em teal claro (teal-200) no modo claro e teal profundo (teal-800) no escuro;
- cards com contraste sobre o fundo;
- cores funcionais nos indicadores;
- shadows discretas;
- bordas finas;
- hover elegante;
- boa densidade de informação;
- sem exagero de efeitos.

### Responsividade e mobile-first

O projeto é um PWA: **toda tela é desenvolvida em mobile-first**, sem exceção.

Regras:

- as classes base (sem prefixo) descrevem o layout de celular;
- breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) apenas **acrescentam** ajustes para telas maiores;
- não escrever o layout desktop primeiro para depois "desfazer" no mobile (evitar `max-*:` como estratégia principal);
- a largura máxima de conteúdo é **1440px** (`max-w-360` no Tailwind v4, equivalente a 90rem);
- conteúdo é centralizado com `mx-auto w-full max-w-360`; fundos e faixas de cor podem ocupar a largura total da viewport, mas o conteúdo interno respeita o limite;
- espaçamento lateral progressivo: `px-4` → `sm:px-6` → `lg:px-8`;
- tipografia, espaçamentos, alturas e ícones também crescem progressivamente por breakpoint;
- alturas de seções visuais (hero, carrossel, banners) usam proporção (`aspect-*`) adaptada por breakpoint e limitada pela viewport (`max-h-[calc(100dvh-...)]`), em vez de alturas fixas;
- usar unidades dinâmicas de viewport (`dvh`/`svh`) em vez de `vh`;
- nenhuma tela pode ter scroll horizontal, de 320px até 1440px ou mais;
- alvos de toque com no mínimo 40px (preferencialmente 44px) no mobile;
- navegação com muitos itens deve colapsar em menu no mobile;
- imagens com tamanho adequado ao uso (WebP, dimensão máxima compatível com 1440px em telas de alta densidade) e `loading="lazy"` quando fora da primeira dobra.

Larguras de referência para validação:

```text
320px   celular pequeno
390px   celular padrão
768px   tablet
1024px  notebook pequeno
1440px  largura máxima de conteúdo
```

### Assets de marca

Atualmente utilizados:

```text
src/assets/brand/living-stone-green.png
src/assets/brand/logo-viva-white.png
```

No shell autenticado:

- símbolo `living-stone-green.png` fica associado à região da sidebar;
- é clicável e leva à Home;
- `logo-viva-white.png` fica centralizada no header.

---

## 11. TanStack Router

O projeto usa roteamento file-based.

Configuração relevante:

```ts
tanstackRouter({
  target: 'react',
  autoCodeSplitting: true,
  routesDirectory: './src/app/router/routes',
  generatedRouteTree: './src/app/router/routeTree.gen.ts',
  quoteStyle: 'single',
});
```

### Regras

- Não editar `routeTree.gen.ts` manualmente.
- Não implementar `React.lazy` manual nas rotas file-based sem necessidade específica.
- `autoCodeSplitting: true` já é a estratégia oficial.
- Preferir `beforeLoad` para guards de rota.
- Preferir rotas pathless para layouts/grupos protegidos.

### Configuração global do Router

```text
defaultPreload: intent
defaultPreloadStaleTime: 0
defaultPendingMs: 150
defaultPendingMinMs: 300
```

`defaultPreloadStaleTime: 0` é intencional: TanStack Query deve controlar a atualidade de dados de servidor.

### Estados globais

Existem componentes globais para:

- erro de rota;
- rota não encontrada;
- pending/loading.

O loading global usa overlay full-screen e bloqueia scroll/interação durante o estado de carregamento.

Não deixar rotas temporárias como `/test-error` ou `/test-loading` no código final.

---

## 12. Autenticação atual e Route Guard

### Estado atual

Autenticação temporária apenas para fechar o fluxo funcional do frontend.

Não existe validação real de credenciais ainda.

O login aceita:

- e-mail válido;
- senha não vazia.

Após submit válido:

1. cria objeto com `email`;
2. persiste no localStorage;
3. navega para `/`.

### Chave de localStorage

Usar exatamente:

```text
@comunidade-viva:web:auth:user
```

Formato atual:

```json
{
  "email": "usuario@exemplo.com"
}
```

### Guard autenticado

Rota pathless:

```text
/_authenticated
```

Ela verifica `getStoredAuthUser()` em `beforeLoad`.

Fluxo:

```text
SEM USUÁRIO
/ → /login

COM USUÁRIO
/ → layout autenticado → Home

COM USUÁRIO
/login → /
```

### Logout

Logout deve:

1. remover `@comunidade-viva:web:auth:user`;
2. navegar para `/login`;
3. usar `replace: true` quando apropriado para não deixar fluxo de retorno inválido.

### Aviso obrigatório

O objeto em localStorage é apenas um mecanismo temporário de controle de fluxo.

**Não é autenticação segura.**

Quando backend/BFF estiver pronto, trocar por fluxo real de autenticação/sessão.

---

## 13. Login — comportamento aprovado

A View de login segue as seguintes regras:

- campos: E-mail e Senha;
- E-mail recebe foco automaticamente ao entrar na tela;
- senha pode ser exibida/ocultada;
- validação com Zod + React Hook Form;
- `mode: 'onTouched'`;
- erro aparece após o campo ser tocado e perder foco;
- botão `Entrar` começa desabilitado;
- botão só habilita quando o formulário estiver válido;
- botão permanece desabilitado durante submit;
- loading global bloqueia a interação durante operações assíncronas;
- após login válido, navega para `/`.

Regra atual do disabled:

```ts
const isSubmitDisabled = !isDirty || !isValid || isSubmitting;
```

### Schema atual

```ts
export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe a senha.'),
});
```

---

## 14. Layout autenticado

O shell autenticado contém:

```text
Header
├── marca associada à sidebar
├── botão hamburger
├── logo central
├── e-mail do usuário
├── divisor
└── Sair

Sidebar
├── modo expanded
├── modo collapsed
├── modo hidden
├── Dashboard
├── Tema (sistema/claro/escuro) no rodapé
└── Sair no rodapé

SPA
└── <Outlet />
```

### Modos da sidebar

```ts
export type SidebarMode = 'expanded' | 'collapsed' | 'hidden';
```

#### `expanded`

- ícones + textos;
- largura completa.

#### `collapsed`

- somente ícones;
- tooltips do shadcn (`TooltipHint`);
- largura reduzida.

#### `hidden`

- sidebar totalmente oculta;
- botão hamburger permanece disponível para restaurá-la.

O último modo visível deve ser lembrado em memória da View enquanto ela estiver montada, para que restaurar uma sidebar oculta retorne ao estado `expanded` ou `collapsed` anterior.

---

## 15. Home / Dashboard

A Home atual é um dashboard inicial com dados mockados.

Estrutura MVVM:

```text
features/home/presentation/
├── models/
│   └── home.model.ts
├── view-models/
│   └── home.view-model.ts
└── views/
    └── home.view.tsx
```

### Conteúdo atual

Resumo:

- Membros;
- Visitantes;
- Eventos;
- Ministérios.

Seções:

- Próximos eventos;
- Atividades recentes.

### Regra importante

Os números e eventos atuais são **mocks temporários**.

Quando a API existir:

- preservar o máximo possível da View;
- mover obtenção/transformação para o fluxo application/infrastructure/ViewModel;
- usar TanStack Query para dados remotos.

---

## 16. TanStack Query

Configuração global atual:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### Regras

- Dados vindos da API são server state.
- Server state fica no TanStack Query.
- Não duplicar resposta de query no Zustand.
- Cache, refetch, staleTime e invalidation devem ser tratados pelo Query.
- Zustand fica para estado global de cliente/UI quando realmente necessário.

---

## 17. Zustand

Zustand faz parte da stack oficial para estado global de cliente.

Usar somente quando o estado:

- não for server state;
- precisar ser compartilhado entre áreas distantes;
- não pertencer naturalmente a uma ViewModel local;
- não puder ser resolvido melhor com estado local ou context/provider específico.

Não criar store global por conveniência.

Exemplos adequados:

- preferência global de UI;
- estado de shell persistido entre páginas;
- configuração de sessão de interface que não vem do servidor.

---

## 18. HTTP e Ky

Ky é o cliente HTTP adotado para o novo projeto.

Regras para a futura camada HTTP:

- cliente centralizado em `shared` ou infraestrutura adequada;
- URL base obtida de `env.VITE_API_URL`;
- nunca hardcodar endpoint de ambiente em uma View;
- não usar `fetch` diretamente em Views;
- não introduzir Axios;
- erros devem ser normalizados antes de chegar à View quando possível;
- autenticação futura deve ser integrada no cliente/adapters, não espalhada pelo código.

---

## 19. Environment variables

A configuração é validada por Zod em runtime.

Schema atual:

```ts
const envSchema = z.object({
  VITE_ENV: z.enum(['development', 'homologation', 'staging', 'production']),
  VITE_API_URL: z.url(),
});
```

### Regras

- variável ausente/inválida deve falhar explicitamente;
- não usar `import.meta.env.*` espalhado pelo projeto quando `env` já é a abstração;
- qualquer variável `VITE_*` vai para o bundle do frontend e **não deve conter segredo**;
- secrets nunca devem ser armazenados em arquivos versionados ou em `AGENTS.md`.

Ambientes reconhecidos:

```text
development
homologation
staging
production
```

---

## 20. PWA

A aplicação é PWA.

Configuração atual:

- `vite-plugin-pwa`;
- estratégia `generateSW`;
- `registerType: 'prompt'`;
- Workbox;
- update prompt próprio;
- service worker desabilitado no dev;
- `cleanupOutdatedCaches: true`;
- `clientsClaim: true`.

### Atualização de versão

`PwaUpdatePrompt` informa que existe nova versão e oferece botão `Atualizar`.

Não mudar silenciosamente para auto-update sem decisão explícita.

### Pendência conhecida

O conjunto definitivo de ícones PWA 192/512/maskable ainda deve ser tratado quando o branding final estiver pronto.

---

## 21. Loading global

`LoadingOverlay` deve:

- ocupar toda a viewport;
- ficar acima de toda a aplicação;
- centralizar o spinner;
- impedir scroll;
- indicar cursor de espera;
- bloquear interação visualmente;
- restaurar `overflow` anterior no cleanup.

Uso atual:

```tsx
{
  isSubmitting && <LoadingOverlay />;
}
```

Não criar spinners globais concorrentes sem necessidade.

---

## 22. Formulários

Stack:

- React Hook Form;
- Zod;
- `@hookform/resolvers/zod`.

### Padrão

1. Schema no `*.model.ts` da apresentação quando específico da View.
2. `useForm` no ViewModel.
3. View recebe estado/handlers do ViewModel.
4. Erros vêm do RHF/Zod.
5. Botões refletem `isValid`, `isDirty` e `isSubmitting` conforme o fluxo.

### Acessibilidade

- `Label` corretamente associado com `htmlFor`;
- `id` nos inputs;
- `aria-invalid` quando aplicável;
- botões icon-only recebem `aria-label`;
- inputs usam `autoComplete` correto;
- foco inicial só quando melhora o fluxo.

---

## 23. Testes

### Unit/component tests

Stack:

- Vitest;
- Testing Library;
- `@testing-library/jest-dom`;
- jsdom.

### Regra de estrutura

Para cada arquivo de teste:

- exatamente **um `describe`**;
- pode haver vários `it`;
- cada `it` deve possuir **exatamente um `expect`**.

Exemplo:

```tsx
describe('Heading', () => {
  it('renders the requested heading level', () => {
    render(<Heading level={2}>Comunidade Viva</Heading>);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Comunidade Viva',
      }),
    ).toBeInTheDocument();
  });
});
```

### E2E

Playwright:

- Chromium como projeto inicial;
- base URL local `http://127.0.0.1:4173`;
- servidor iniciado por `pnpm dev --host 127.0.0.1 --port 4173`;
- trace no primeiro retry.

### Filosofia de teste

Preferir comportamento observável do usuário.

Evitar testar detalhes internos de implementação.

Ao corrigir bug relevante, adicionar teste de regressão quando razoável.

---

## 24. Qualidade e validação

Comando canônico para correções + validações estáticas:

```bash
pnpm quality:fix
```

Ele executa:

```text
lint:fix
format
lint
format:check
typecheck
```

Não substituir isso por uma sequência manual diferente sem motivo.

### Comandos úteis

```bash
pnpm dev
pnpm quality:fix
pnpm quality:check
pnpm test:run
pnpm test:coverage
pnpm test:e2e
pnpm build
```

### Antes de finalizar uma alteração

No mínimo:

```bash
pnpm quality:fix
```

Quando o comportamento alterado tiver testes relacionados, executar também os testes apropriados.

Para mudanças de build/deploy ou antes de um marco importante:

```bash
pnpm quality:fix && pnpm build
```

---

## 25. Hot Module Reload

O ambiente Windows/Git Bash apresentou falha de file watcher nativo.

Por isso o Vite está configurado com polling:

```ts
server: {
  watch: {
    usePolling: true,
    interval: 100,
  },
},
```

Não remover essa configuração sem confirmar que o HMR continua funcionando no ambiente Windows do projeto.

---

## 26. Editor e workspace

Configurações são locais do projeto, não globais.

### VS Code

Formatter oficial:

```text
oxc.oxc-vscode
```

Configurações importantes:

- format on save;
- format on paste;
- ruler em 100;
- tab size 2;
- TS workspace version;
- auto imports com alias não relativo;
- Tailwind IntelliSense para `cn` e `cva`.

### Extensões

Recomendadas incluem:

- EditorConfig;
- Oxc;
- Tailwind CSS IntelliSense;
- Vitest Explorer;
- Playwright;
- Error Lens;
- Pretty TypeScript Errors;
- dotenv;
- YAML;
- GitHub Actions;
- GitHub Pull Requests;
- GitLens;
- markdownlint;
- Code Spell Checker EN/PT-BR.

Não recomendar para este workspace:

- ESLint extension;
- Prettier extension.

---

## 27. Router + Query: separação de responsabilidades

TanStack Router controla:

- URL;
- hierarquia de rotas;
- layouts;
- guards;
- preload de rota;
- estados pending/error/not-found.

TanStack Query controla:

- dados remotos;
- cache;
- stale time;
- retry;
- invalidation;
- refetch.

Não use Router cache como substituto de Query para server state.

---

## 28. Git e commits

### Estratégia atual

Durante a fase inicial do projeto, mudanças têm sido feitas diretamente em `main`.

Não mudar esse fluxo por conta própria enquanto o responsável não solicitar branch/PR obrigatório.

### Commits

Usar Conventional Commits e commits pequenos/coerentes.

Exemplos:

```text
feat: add login flow with MVVM architecture
feat: add local authentication flow and route guards
feat: add authenticated dashboard layout
feat: refine dashboard visual design
fix: improve button cursor states
build: configure Cloudflare Workers deployment
test: configure Playwright end-to-end testing
chore: standardize repository line endings
```

### Comando preferido

Quando o usuário pedir commit, fornecer o comando em uma única linha:

```bash
git add . && git commit -m "<mensagem>" && git push
```

Regras:

- sempre `git add .` nesse fluxo;
- não inventar múltiplos comandos para o mesmo commit;
- não pedir `git status` repetidamente sem necessidade técnica real.

---

## 29. Modo de interação ao orientar alterações

Quando estiver guiando o responsável pelo projeto em terminal:

- usar Git Bash como referência;
- usar Node para scripts rápidos de alteração de arquivos;
- não depender de Python, pois Python não é requisito do ambiente;
- fornecer no máximo 3 comandos por etapa quando possível;
- aguardar confirmação antes de avançar em setups longos;
- sempre fornecer o comando executável quando a alteração precisar ser aplicada;
- ser direto e resumido;
- evitar checagens repetitivas desnecessárias.

### Alterações automáticas simples

Preferir:

```bash
node -e '...'
```

ou here-doc de shell para criação/substituição de arquivos.

Não assumir que `python` está instalado.

---

## 30. Cloudflare Workers

Hospedagem atual: **Cloudflare Workers + Static Assets**.

Configuração versionada:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "comunidade-viva-web",
  "compatibility_date": "2026-10-04",
  "workers_dev": true,
  "preview_urls": true,
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application",
  },
  "previews": {},
}
```

### Produção

Branch:

```text
main
```

URL atual:

```text
https://comunidade-viva-web.comvivati.workers.dev
```

Build de produção usa o build Vite do projeto e deploy via Wrangler.

### Worker (/api)

O Worker em `worker/index.ts` executa **somente** para `/api/*` (`run_worker_first`); o restante continua servido como asset estático.

Uso atual: `POST /api/guest-wifi/authorize`, que libera a rede "VIVA - Visitantes" no Omada Controller (External Portal Server). A rota pública `/wifi-visitantes` (fora de qualquer menu) é o portal cativo configurado no Omada.

- credenciais do Omada ficam apenas em secrets do Worker (`pnpm exec wrangler secret put <NOME>`): `OMADA_CONTROLLER_URL`, `OMADA_CONTROLLER_ID`, `OMADA_SITE_ID`, `OMADA_OPERATOR_USERNAME`, `OMADA_OPERATOR_PASSWORD`;
- localmente, usar `.dev.vars` (não versionado; modelo em `.dev.vars.example`);
- após alterar `wrangler.jsonc`, regenerar os tipos com `pnpm exec wrangler types worker/worker-configuration.d.ts`;
- o front chama o Worker via `workerApiClient` (`src/shared/http/worker-api-client.ts`), não via `VITE_API_URL`;
- nunca registrar dados pessoais (nome, telefone) em logs do Worker.

### SPA fallback

`not_found_handling: 'single-page-application'` é necessário para rotas client-side como `/login` funcionarem em acesso direto.

Não remover.

### Previews

Preview URLs estão habilitadas para branches de preview.

### Infraestrutura adiada

Não adicionar sem pedido explícito:

- novo CI/CD;
- Docker;
- Husky;
- commitlint;
- semantic-release;
- geração automática de changelog;
- infraestrutura adicional.

Cloudflare deployment atual deve ser preservado.

---

## 31. Padrões de arquivos

Convenções recomendadas:

```text
*.view.tsx           View MVVM
*.view-model.ts      ViewModel MVVM
*.model.ts           Model da apresentação
*.use-case.ts        Caso de uso
*.repository.ts      Contrato/implementação de repository conforme camada
*.storage.ts         Persistência/storage adapter
*.service.ts         Serviço quando semanticamente necessário
*.test.ts            Teste unitário sem JSX
*.test.tsx           Teste de componente
*.spec.ts            E2E/integração quando apropriado
```

### Nomes

- arquivos em kebab-case;
- tipos/componentes em PascalCase;
- funções/variáveis em camelCase;
- constantes globais em UPPER_SNAKE_CASE quando realmente constantes de configuração interna.

---

## 32. React e performance

### React Compiler

Está habilitado. Não aplicar `useMemo`/`useCallback` indiscriminadamente apenas por hábito.

Use otimizações manuais quando houver razão mensurável ou requisito de identidade referencial.

### Componentes

- componentes pequenos e coesos;
- extrair quando existe responsabilidade reutilizável, não só para reduzir linhas;
- evitar componentes gigantes com regra de negócio e layout misturados;
- manter lógica de View no ViewModel quando apropriado.

### Estado

Ordem de preferência:

1. estado derivado sem armazenar;
2. estado local;
3. ViewModel;
4. TanStack Query para server state;
5. Zustand para estado global de cliente realmente compartilhado.

---

## 33. Acessibilidade

Toda funcionalidade nova deve considerar:

- navegação por teclado;
- foco visível;
- `aria-label` em botões somente com ícone;
- `aria-invalid` em campos inválidos;
- `role` adequado em estados de loading/status;
- `alt` significativo em imagens informativas;
- `aria-hidden` em imagens puramente decorativas;
- contraste suficiente;
- tooltips (`TooltipHint`, shadcn) quando a sidebar estiver apenas com ícones.

Não remover acessibilidade para simplificar CSS.

---

## 34. Erros e estados assíncronos

Toda tela que depender de dados assíncronos deve prever quando aplicável:

- loading;
- erro;
- vazio;
- sucesso.

Não renderizar apenas o happy path.

Para erro de rota, usar a infraestrutura global do Router.

Para operação de formulário, o ViewModel deve expor o estado necessário para a View.

---

## 35. Segurança

### Frontend

Nunca armazenar:

- senha;
- segredo;
- API key privada;
- token administrativo;
- credencial de banco;
- chave privada.

em:

- código;
- localStorage sem necessidade explícita;
- `.env` versionado;
- `AGENTS.md`;
- logs.

### Vite

Variáveis `VITE_*` são públicas no bundle.

Nunca tratá-las como secret.

### Auth atual

O objeto de usuário no localStorage é temporário e **não concede segurança real**.

O guard atual é apenas UX/controle de navegação até a autenticação real existir.

---

## 36. Regras para futuras APIs/BFF

O projeto prevê backend em Node/TypeScript e arquitetura BFF + microserviços.

No frontend:

- comunicar preferencialmente com o BFF apropriado;
- não espalhar URLs de microserviços na UI;
- encapsular contratos de infraestrutura;
- modelar erros de forma consistente;
- usar TanStack Query para chamadas de leitura/mutação;
- invalidar queries de forma direcionada após mutations.

A implementação concreta do backend não faz parte deste repositório neste momento.

---

## 37. Boas práticas para novas features

Ao criar uma feature nova, seguir aproximadamente esta sequência:

1. Definir responsabilidade e rota.
2. Criar tipos de domínio necessários.
3. Criar contratos/ports quando necessário.
4. Criar use case.
5. Criar implementação de infraestrutura.
6. Criar `*.model.ts` da apresentação.
7. Criar `*.view-model.ts`.
8. Criar `*.view.tsx`.
9. Integrar rota file-based.
10. Criar testes relevantes.
11. Rodar `pnpm quality:fix`.
12. Rodar testes/build conforme impacto.
13. Versionar em commit semântico pequeno.

Nem toda feature precisa de arquivos vazios em todas as camadas. Crie apenas abstrações que tenham responsabilidade real.

---

## 38. Exemplo de feature completa

```text
src/features/members/
├── domain/
│   ├── member.ts
│   └── member.repository.ts
├── application/
│   └── use-cases/
│       ├── list-members.use-case.ts
│       └── create-member.use-case.ts
├── infrastructure/
│   └── repositories/
│       └── member-http.repository.ts
└── presentation/
    ├── components/
    │   └── member-card.tsx
    ├── models/
    │   └── members.model.ts
    ├── view-models/
    │   └── members.view-model.ts
    └── views/
        └── members.view.tsx
```

Exemplo conceitual:

```ts
export const useMembersViewModel = () => {
  // Queries/use cases/estado de UI.

  return {
    // Apenas o que a View precisa consumir.
  };
};
```

---

## 39. Componentes: shadcn + atomic design

### Regra obrigatória

**Sempre usar os componentes de UI do shadcn** (base: Base UI). Antes de implementar qualquer elemento de interface (tooltip, dialog, dropdown, popover, tabs, select, toast etc.), adicionar o componente oficial com `pnpm dlx shadcn@<versão> add <componente>` e adaptá-lo ao padrão do projeto (seção 47). Não reimplementar comportamento que o shadcn já oferece, nem usar atributos nativos como substitutos (ex.: `title` no lugar de `Tooltip`).

### Grupos em `src/components`

```text
src/components/
├── ui/          átomos: componentes do shadcn e primitivas que encapsulam HTML nativo
├── molecules/   moléculas: combinam alguns átomos em uma peça reutilizável
└── organisms/   organismos: blocos maiores de interface, compostos por moléculas e átomos
```

- **`ui/` (átomos):** `Alert`, `Anchor`, `Box`, `Button`, `Card`, `Carousel`, `Checkbox`, `Form`, `Heading`, `Image`, `Input`, `Label`, `LoadingOverlay`, `Spinner`, `Text`, `Tooltip`. Única camada que pode usar HTML nativo.
- **`molecules/`:** `CardSectionHeader` (cabeçalho de seção de card com ícone, título e descrição), `TooltipHint` (tooltip do shadcn sobre um elemento interativo), `ThemeToggle` (escolha de tema), `SidebarNavItem` (item do menu lateral com tooltip quando recolhido).
- **`organisms/`:** `PublicHeader`, `AppFooter`, `AppSidebar`, `StatusPage`.

Cada componente fica em sua própria pasta (`molecules/theme-toggle/theme-toggle.tsx`), junto do seu teste, e é exportado pelo `index.ts` do grupo (ver 7.12).

Regras:

- moléculas e organismos compõem átomos de `ui/`; nunca usam HTML nativo;
- componentes usados por uma única feature ficam em `features/<feature>/presentation/components`; quando passam a ser reutilizados, sobem para `src/components`;
- tooltips usam sempre `TooltipHint` (ou `Tooltip` do shadcn). O `TooltipProvider` é montado no `main.tsx`;
- o tooltip é só uma dica visual: o elemento continua com seu nome acessível (`aria-label`).

Antes de criar uma nova tag nativa encapsulada, verificar se já existe uma primitiva adequada.

---

## 40. Fast Refresh

A regra `react/only-export-components` é utilizada.

Evitar misturar exports incompatíveis com Fast Refresh em arquivos de componentes.

`src/components/ui/**` possui exceções específicas onde necessário.

Se o lint alertar ao gerar componente shadcn, adaptar o arquivo ao padrão do projeto em vez de desabilitar a regra globalmente.

---

## 41. Arquivos gerados

Não editar manualmente:

```text
src/app/router/routeTree.gen.ts
```

Esse arquivo é gerado pelo plugin do TanStack Router.

Evitar lint/format manual em artefatos gerados quando eles já estiverem ignorados pela configuração.

---

## 42. Design do dashboard atual

Cards de resumo usam diferenciação funcional de cor:

- Membros: ciano (`chart-1`);
- Visitantes: violeta (`chart-2`);
- Eventos: âmbar (`chart-3`);
- Ministérios: verde (`chart-4`).

Padrão visual:

- faixa/acento superior;
- ícone em container destacado;
- glow discreto;
- hover com elevação;
- cards (`card`) contra o fundo da página (`background`), nos dois modos.

Eventos:

- cards compactos;
- data + horário com ícones;
- realce teal;
- borda/hover refinados.

Preservar essa linguagem ao expandir o dashboard.

---

## 43. O que não fazer

Não:

- usar Python como requisito para scripts de setup do projeto;
- criar HTML nativo diretamente em Views/layouts quando a regra de UI se aplica;
- usar function declarations no app;
- usar exports agrupados no final;
- usar default exports no app;
- usar import relativo manual;
- instalar ESLint ou Prettier;
- adicionar Axios;
- duplicar server state no Zustand;
- editar `routeTree.gen.ts`;
- criar lazy loading manual das file routes sem necessidade;
- tratar localStorage atual como autenticação segura;
- deixar rota de teste temporária commitada;
- adicionar ferramentas de infraestrutura adiadas sem solicitação;
- criar abstrações vazias apenas para “cumprir DDD”;
- alterar identidade visual sem preservar a direção corporativa/futurista;
- fazer upgrade major sem verificar compatibilidade;
- inserir secrets no frontend.

---

## 44. Checklist para alteração de código

Antes de concluir qualquer tarefa:

- [ ] A mudança respeita DDD + MVVM?
- [ ] Os arquivos MVVM usam `.view.tsx`, `.view-model.ts`, `.model.ts`?
- [ ] Views não acessam infraestrutura diretamente sem necessidade?
- [ ] Server state está no TanStack Query?
- [ ] Não há imports relativos manuais?
- [ ] Só há arrow functions?
- [ ] Imports de componentes vêm do barrel do grupo e hooks/objetos estão desestruturados?
- [ ] Exports são diretos?
- [ ] Não há `export default` no app?
- [ ] Props React usam `type`?
- [ ] Sem HTML nativo em camada proibida?
- [ ] Classes Tailwind estão no `className`, em `cva(...)` ou em `cn(...)` (nunca em string solta)?
- [ ] Todas as cores usam tokens semânticos (sem hex, rgb/oklch ou paleta padrão do Tailwind)?
- [ ] A tela foi construída mobile-first e validada de 320px até 1440px?
- [ ] O conteúdo respeita a largura máxima de 1440px (`max-w-360`)?
- [ ] Acessibilidade foi considerada?
- [ ] Loading/error/empty state foram considerados quando aplicável?
- [ ] Nenhum secret foi introduzido?
- [ ] `pnpm quality:fix` passou?
- [ ] Testes relevantes passaram?
- [ ] Build foi validado quando a mudança afeta bundling/deploy?
- [ ] Nenhuma rota/arquivo temporário ficou para trás?
- [ ] Commit proposto segue Conventional Commits?

---

## 45. Checklist para novo formulário

- [ ] Schema Zod definido.
- [ ] RHF configurado no ViewModel.
- [ ] Mensagens em pt-BR.
- [ ] `Label` + `htmlFor`.
- [ ] `id` no input.
- [ ] `aria-invalid`.
- [ ] `autoComplete` adequado.
- [ ] Estado disabled coerente.
- [ ] Submit não duplica requisição.
- [ ] Loading durante operação.
- [ ] Erros exibidos de forma acessível.
- [ ] Senhas nunca são persistidas.

---

## 46. Checklist para nova rota protegida

- [ ] É filha de `/_authenticated` quando deve exigir sessão.
- [ ] Não duplica guard localmente sem necessidade.
- [ ] Usa file-based route.
- [ ] Não edita `routeTree.gen.ts`.
- [ ] Layout autenticado permanece único.
- [ ] Navegação usa `Link`/`navigate` do TanStack Router.
- [ ] Estado ativo do menu é perceptível e acessível.

---

## 47. Checklist para componente shadcn novo

Após executar `shadcn add`:

- [ ] Converter function declarations para arrow functions.
- [ ] Converter export final agrupado para export direto.
- [ ] Confirmar semicolons.
- [ ] Confirmar imports ordenados.
- [ ] Ajustar Props para `type` quando aplicável.
- [ ] Confirmar compatibilidade com Base UI atual.
- [ ] Verificar cursor/disabled/focus states.
- [ ] Rodar `pnpm quality:fix`.

---

## 48. Estratégia de evolução

O projeto deve evoluir sem grandes reescritas desnecessárias.

Priorizar:

- composição incremental;
- contratos estáveis;
- substituição de mocks por adapters reais;
- preservação das Views quando backend entrar;
- pequenas refatorações guiadas por necessidade real;
- micro commits.

Exemplo esperado para o dashboard:

```text
Hoje:
HomeViewModel → mocks locais

Futuro:
HomeViewModel → TanStack Query / use case → repository → BFF

HomeView → permanece majoritariamente estável
```

---

## 49. Fonte de verdade em caso de conflito

Se houver conflito entre:

1. solicitação explícita atual do responsável pelo projeto;
2. este `AGENTS.md`;
3. padrões encontrados em código antigo;

seguir nesta ordem:

```text
Solicitação explícita atual
        ↓
AGENTS.md
        ↓
Código legado/inconsistente
```

Quando o código existente contrariar este documento por ser legado ou gerado por ferramenta, não perpetuar o erro automaticamente. Ajustar o novo código ao padrão vigente, salvo quando isso causar quebra fora do escopo.

---

## 50. Resumo de regras não negociáveis

```text
React 19 + TypeScript + Vite
pnpm
DDD + MVVM + feature-first
TanStack Router file-based
TanStack Query para server state
Zustand somente para client state global necessário
Ky para HTTP
RHF + Zod para forms
Tailwind v4 + shadcn/Base UI
Vitest + Testing Library + Playwright
Oxlint + Oxfmt
Arrow functions
Named/direct exports
Sem default export no app
Alias @/
Sem imports relativos manuais
Sem HTML nativo em Views/layouts/composição
Mobile-first sempre (PWA)
Cores somente via tokens semânticos (src/index.css)
Conteúdo com largura máxima de 1440px (max-w-360)
VIEW       = nome.view.tsx
VIEW-MODEL = nome.view-model.ts
MODEL      = nome.model.ts
1 describe por arquivo de teste
1 expect por it
pnpm quality:fix como validação canônica
Git add . + Conventional Commit + push
Cloudflare Workers + Static Assets
Sem secrets em VITE_*
Auth localStorage atual é temporária
UI moderna, corporativa, tecnológica e futurista
```

---

## 51. Regra final para agentes de IA

Antes de responder com código:

1. Identifique a camada correta.
2. Verifique se já existe componente/abstração reutilizável.
3. Preserve as convenções deste arquivo.
4. Não invente infraestrutura desnecessária.
5. Forneça alteração completa e executável quando solicitado.
6. Ao orientar terminal, considere Windows + Git Bash + Node/pnpm.
7. Depois de modificar código, valide com `pnpm quality:fix`.

O objetivo não é apenas fazer o código funcionar: é manter o projeto coerente, previsível e sustentável enquanto cresce.
