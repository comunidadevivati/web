# AGENTS.md — Comunidade Viva Web

> Guia operacional e arquitetural obrigatório para agentes de IA e desenvolvedores que alterarem este repositório.
>
> Última consolidação: 2026-10-14.
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
| i18next         | `26.4.x`             |
| react-i18next   | `17.0.x`             |
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
│   └── theme/
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
infrastructure/http/auth-session-http.gateway.ts
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
│   └── auth-session.ts
├── application/
│   ├── queries/
│   │   └── auth-session.query.ts
│   └── use-cases/
│       ├── get-auth-session.use-case.ts
│       ├── logout.use-case.ts
│       └── login.use-case.ts
├── infrastructure/
│   └── http/
│       └── auth-session-http.gateway.ts
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

### Fluxo de autenticação

```text
LoginView / AuthenticatedLayoutView / guards das rotas
   ↓
ViewModels + authSessionQueryOptions (TanStack Query)
   ↓
use cases (get-auth-session, login, logout)
   ↓
authSessionHttpGateway (implementa AuthSessionGateway)
   ↓
bffClient (Ky) → /auth/* na mesma origem → BFF
```

O `localStorage` não participa da autenticação.

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

Além dela existem `--viva-white`, `--viva-black` e as cores oficiais de marcas de terceiros (`--brand-*`, redes sociais).

**Nova identidade visual (em adoção):** a paleta abaixo foi adicionada em `src/index.css` por decisão do responsável e vai substituir gradualmente o Teal. O **modo escuro** já usa: fundo principal `charcoal-brown` (#403d39), cards e modais `charcoal`, texto principal branco, botão principal `light-sea-green` com texto preto, borda dos campos `light-sea-green`, fundo dos campos `charcoal` e contorno de foco branco. Os demais tokens (texto secundário, header, menu lateral, gráficos) e o modo claro ainda usam o Teal. Ao mapear novos tokens, conferir os contrastes (seção 33).

| Grupo                   | Tokens                                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neutros                 | `charcoal` #50514f, `charcoal-brown` #403d39, `blue-slate` #5c6b73, `blue-slate-deep` #4c5c68, `pale-sky` #cad8de, `alabaster-grey` #e5e6e4, `platinum` #eaebed     |
| Azuis e verdes-azulados | `deep-space-blue` #0b3954, `dark-teal` #084c61, `dark-cyan` #0e9594, `light-sea-green` #07beb8, `strong-cyan` #3dccc7, `neon-ice` #30f2f2, `neon-ice-vivid` #00f6ed |
| Funcionais              | `jungle-green` #0ead69, `golden-pollen` #ffd23f, `mustard` #ffe347, `punch-red` #e71d36, `rosy-copper` #db504a, `grapefruit-pink` #ff6b6b                           |

Não introduzir outras famílias de cor sem decisão explícita.

#### Tokens disponíveis

| Token                                                                                                                                                                         | Uso                                                                                                                        | Claro                                 | Escuro                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------ |
| `background` / `foreground`                                                                                                                                                   | fundo de todas as páginas e texto sobre ele                                                                                | teal-200 / 950                        | charcoal-brown / branco  |
| `card` / `card-foreground`                                                                                                                                                    | cards, formulários e painéis sobre o fundo (via `surface-card`)                                                            | teal-100 / 950                        | charcoal / branco        |
| `muted` / `muted-foreground`                                                                                                                                                  | superfícies sutis e texto secundário (sobre `background` e `card`)                                                         | teal-50 / 800                         | teal-950 / 200           |
| `secondary` / `secondary-foreground`                                                                                                                                          | botões e superfícies secundárias                                                                                           | teal-100 / 950                        | teal-700 / 50            |
| `border`, `input`, `ring`                                                                                                                                                     | bordas, campos e foco                                                                                                      | teal-300/300/600                      | teal-700/700/300         |
| `input-border`                                                                                                                                                                | borda dos campos (`Input`, `InputGroup`), fixa (não muda no foco); no claro fica 2:1 por decisão de identidade             | light-sea-green                       | light-sea-green          |
| `subtitle`                                                                                                                                                                    | subtítulos (componente `Subtitle`, 1rem, semibold, 90% de opacidade); 3,1:1 sobre o card escuro, por decisão de identidade | light-sea-green                       | light-sea-green          |
| `input-background`                                                                                                                                                            | fundo dos campos                                                                                                           | transparente                          | charcoal                 |
| `placeholder`                                                                                                                                                                 | placeholder dos campos (via `field-control`, com 80% de opacidade)                                                         | texto secundário (`muted-foreground`) | pale-sky                 |
| `popover` / `popover-foreground`                                                                                                                                              | modais, menus e popovers                                                                                                   | teal-50 / 950                         | charcoal / branco        |
| `focus-ring`, `focus-ring-halo`                                                                                                                                               | indicador de foco do teclado (contorno + halo), ver seção 33                                                               | teal-950 / branco                     | branco / charcoal        |
| `destructive`                                                                                                                                                                 | erros e ações destrutivas                                                                                                  | vermelho                              | vermelho                 |
| `destructive-strong`                                                                                                                                                          | texto de erro (mensagens de campo, rótulo inválido, `Alert` destrutivo), contraste AAA 7:1+                                | red-800                               | vermelho claro           |
| `success`, `success-strong`                                                                                                                                                   | sucesso: faixa e barra do toast (`success`) e ícone (`success-strong`, 6,8:1 / 7,3:1)                                      | jungle-green / green-800              | jungle-green / green-100 |
| `primary` / `primary-foreground`                                                                                                                                              | cor da marca (Teal 500) e texto sobre ela                                                                                  | teal-500 / 950                        | light-sea-green / preto  |
| `primary-strong`                                                                                                                                                              | texto/ícone da marca sobre `background` e `card` (eyebrows, links, destaque)                                               | teal-800                              | teal-200                 |
| `brand-gradient-start`, `brand-gradient-middle`, `brand-gradient-end`, `brand-foreground`                                                                                     | painel de marca com gradiente (login) e texto sobre ele                                                                    | teal-600→800→950                      | igual                    |
| `header`, `header-foreground`, `header-border`, `header-accent`, `header-accent-foreground`                                                                                   | headers (público, autenticado e Wi-Fi), iguais nos dois modos                                                              | teal-950 / white                      | igual                    |
| `sidebar`, `sidebar-foreground`, `sidebar-muted-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border` | menu lateral do app autenticado                                                                                            | teal-400 / 950                        | teal-900 / white         |
| `overlay`, `overlay-foreground`                                                                                                                                               | camadas sobre fotos/mídia (carrossel) e base das sombras                                                                   | black / white                         | igual                    |
| `chart-1` … `chart-4`                                                                                                                                                         | cores categóricas de indicadores e gráficos                                                                                | ajustadas por modo                    | ajustadas por modo       |
| `social-*`                                                                                                                                                                    | identidade oficial das redes sociais                                                                                       | igual                                 | igual                    |

**Superfície de card:** cards usam o utilitário `surface-card` (definido com `@utility` no `src/index.css`) em vez de `bg-card`. Ele aplica o fundo do card e reescopa os tokens de conteúdo (`foreground`, `muted`, `muted-foreground`, `primary`, `primary-foreground`, `primary-strong`, `border`, `input`, `ring`) para os valores `--card-*`, mantendo o contraste de tudo que está dentro do card nos dois modos. Componentes dentro do card continuam usando os utilitários de sempre (`text-muted-foreground`, `bg-primary`...).

**Header e footer:** o `AppFooter` usa os tokens `header-*`, tem altura compacta (`h-14`), fica fixo no rodapé (`sticky bottom-0`) e aparece em todas as telas com header. Ele usa **container queries** (`@container`, `@3xl:`, `@5xl:`) para se adaptar à própria largura, que muda com a sidebar: largo = créditos à esquerda, símbolo da igreja no centro, autoria + seletores de idioma e tema compactos à direita; estreito = símbolo + créditos à esquerda e as preferências recolhidas no `PreferencesPopover`. Páginas com header/footer fixos usam `overflow-x-clip` (não `overflow-x-hidden`, que quebra o `sticky`).

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
- o controle de troca é o componente `ThemeToggle` (`src/components/molecules/theme-toggle`), exibido junto do seletor de idioma no footer (`PreferencesControls` ou `PreferencesPopover`) e no login, que não tem footer.

Toda tela nova deve ser validada nos dois modos.

### Idiomas (i18n)

A aplicação inteira é traduzida (páginas públicas, login, Wi-Fi de visitantes e área logada). Idiomas suportados: **pt-BR** (padrão e fonte da verdade) e **en-US**.

Stack: `i18next` + `react-i18next`, com chaves tipadas.

```text
src/app/i18n/
├── i18n.model.ts            Locale, LocalePreference, Translations, resolveLocale
├── i18n.config.ts           instância do i18next (os dois idiomas vão no bundle; funciona offline)
├── i18next.d.ts             CustomTypeOptions: tipagem global das chaves a partir do pt-BR
├── locale.store.ts          preferência salva no aparelho (@comunidade-viva:web:locale)
├── use-locale-sync.ts       aplica o idioma e o <html lang> (LocaleProvider no main.tsx)
├── use-route-head-refresh.ts atualiza os títulos das páginas ao trocar o idioma
├── translation-key.ts       TranslationKey<'namespace'> para chaves fora do t()
└── locales/
    ├── pt-BR/               fonte da verdade (as const)
    └── en-US/               satisfies Translations: chave faltando ou sobrando quebra o typecheck
```

Regras:

- **nenhum texto de interface fixo no código**: todo texto visível, `aria-label`, `alt`, placeholder, tooltip e título de página vem de `t('chave')`;
- namespaces: `common` (shell, navegação, preferências, estados globais) e um por feature (`auth`, `home`, `dashboard`, `contact`, `guestWifi`); nova feature ganha seu namespace;
- adicionar a chave **primeiro no pt-BR** e depois no en-US (o typecheck aponta o que falta);
- usar `useTranslation('namespace')` na View/ViewModel e desestruturar (`const { t } = useTranslation('auth')`);
- textos com dados usam interpolação (`t('footer.rights', { year })`) e plural com sufixos `_one`/`_other` (`t('success.redirect', { count })`);
- validações do Zod usam **chaves** como mensagem (`satisfies Record<string, TranslationKey<'auth'>>`) e a View traduz com o `getFieldError` do ViewModel;
- datas, horas e números são formatados com `Intl` no idioma atual (`i18n.language`), nunca com texto fixo;
- títulos de página: `getLocalizedPageTitle('chave')` no `head` da rota;
- textos longos e estruturados (ex.: termos de uso do Wi-Fi) ficam como conteúdo por idioma no `models/` da feature; a tradução em inglês dos termos é de cortesia e avisa que a versão em português prevalece;
- preferência: `system` (padrão, segue o navegador), `pt-BR` ou `en-US`, escolhida no `LocaleToggle`.

Preferências globais (idioma + tema) ficam no **footer** de todas as telas (organismos `PreferencesControls` em telas largas e `PreferencesPopover` em telas estreitas) e no login (`PreferencesControls` no canto superior direito). Os seletores usam o `ToggleGroup` do shadcn pela molécula `PreferenceToggleGroup` (tons `header`, `sidebar` e `surface`; tamanhos `default` e `sm`).

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

## 12. Autenticação e Route Guard

### Arquitetura

A autenticação é do BFF (`comunidadevivati/backend`, NestJS) com login simples por **e-mail e senha** (sem Keycloak e sem Redis):

```text
React (formulário) → POST /auth/login → BFF
```

- o front coleta e-mail e senha só para enviá-los ao BFF; nunca os guarda e nunca recebe tokens;
- a sessão é um cookie HttpOnly, assinado e `SameSite=Lax`, emitido pelo BFF;
- nada de autenticação fica em `localStorage` ou `sessionStorage`;
- não implementar autenticação paralela no React.

### Mesma origem (proxy)

As rotas `/auth/*` e `/api/v1/*` (API de negócio do BFF, ex.: organização) são servidas **na origem do front**:

- produção: o Worker (`worker/index.ts`) repassa `/auth/*` e `/api/v1/*` para `BFF_ORIGIN` (secret do Worker), com `redirect: 'manual'`, devolvendo respostas e `Set-Cookie` sem alteração;
- dev: o proxy do Vite (`server.proxy` em `vite.config.ts`) repassa `/auth/*` e `/api/v1/*` para `BFF_PROXY_TARGET` (padrão `http://localhost:3000`).

Motivo: o cookie `SameSite=Lax` não é enviado em `fetch` entre sites diferentes (e `*.workers.dev` é sufixo público). Na mesma origem não há CORS nem `credentials: 'include'`.

Consequências de configuração (fora deste repositório):

- no BFF: `BFF_BASE_URL` e `WEB_BASE_URL` = origem do front.

Não criar rotas da SPA começando com `/auth` ou `/api`. O service worker não faz fallback de navegação nesses prefixos (`navigateFallbackDenylist`).

### Contrato consumido

| Endpoint              | Uso no front                                                                                                                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /auth/me`        | sessão atual: `{ authenticated, csrfToken, user: { subject, email?, name? } }`; 401 = sem sessão                                                                                                                                                |
| `POST /auth/login`    | `{ email, password }`; 200 grava o cookie de sessão e devolve `{ authenticated, message, csrfToken, user }`; 400/401 = credenciais recusadas; 429 = limite de tentativas                                                                        |
| `POST /auth/register` | `{ name, phone, email, password }` (telefone só com dígitos, e-mail em minúsculas); 201 = conta criada e sessão aberta (cookie HttpOnly, mesmo formato do login); 409 = e-mail já cadastrado; 400 = dados recusados; 429 = limite de tentativas |
| `POST /auth/logout`   | encerra a sessão; exige o header `X-CSRF-Token`; 200 com `{ authenticated: false, message }`                                                                                                                                                    |

Contratos em `apps/bff/src/auth/presentation/*.controller.ts` do backend (`POST /auth/login`, `POST /auth/register`, `GET /auth/me` e `POST /auth/logout` implementados no BFF). Não inventar endpoints: conferir o backend antes de consumir algo novo.

### Código

```text
src/features/auth/
├── domain/auth-session.ts                         AuthUser, AuthSession, LoginCredentials, AuthSessionGateway e erros
├── application/
│   ├── queries/auth-session.query.ts              authSessionQueryOptions (['auth', 'session'])
│   └── use-cases/                                 get-auth-session, login, logout
├── infrastructure/http/auth-session-http.gateway.ts
└── presentation/                                  login (model, view-model, view)
src/shared/http/bff-client.ts                      cliente Ky do BFF (mesma origem) + listener de 401
src/app/router/router.ts                           contexto { queryClient } e tratamento de sessão expirada
```

- a sessão (`GET /auth/me`) é server state no TanStack Query; o token CSRF fica só nesse cache, em memória;
- a resposta do `/auth/me` é validada com Zod no gateway; resposta fora do contrato ou falha de rede viram `AuthServiceUnavailableError`;
- query options compartilhadas entre guards e ViewModels ficam em `application/queries/*.query.ts`.

### Guards

O Router recebe `{ queryClient }` como contexto (`createRootRouteWithContext<RouterContext>()`).

```text
/_authenticated  beforeLoad: queryClient.fetchQuery(authSessionQueryOptions)
                 sem sessão ou BFF indisponível → /login
/login           beforeLoad: com sessão → /dashboard; sem sessão ou BFF indisponível → fica no login
```

Após o `POST /auth/login` ou o `POST /auth/register`, o front invalida a sessão em cache, navega para `/dashboard` e mostra a `message` do corpo da resposta (opcional, lida por `parseSessionStart`) em um toast de sucesso.

### Sessão expirada (401)

- um 401 em qualquer chamada ao BFF **fora de `/auth/*`** dispara o listener registrado em `router.ts`: zera a sessão no cache e navega para `/login?reason=expired` (`replace`);
- o 401 de `/auth/me` é o estado normal sem sessão (vira `null`), não um erro.

### Logout

1. `POST /auth/logout` com `X-CSRF-Token` (401 = sessão já encerrada, tratado como sucesso);
2. só após a confirmação do BFF: sessão `null` no cache, navegar para `/login` com `replace: true` e remover do cache os demais dados do usuário;
3. se a chamada falhar, o usuário **continua logado** e vê um aviso (`session.logoutFailed`), para não parecer deslogado com a sessão ativa no servidor.

---

## 13. Login — comportamento aprovado

- formulário com e-mail e senha (RHF + Zod em `login.model.ts`), validado no submit e ao sair do campo;
- o campo de e-mail recebe foco ao entrar na tela; `autoComplete` `email` e `current-password`;
- o botão `Entrar` só fica desabilitado durante o envio (o preenchimento automático de senhas nem sempre marca o formulário como alterado);
- durante o envio: `LoadingOverlay`, botão desabilitado e texto `login.submitting`;
- sucesso: invalida a sessão em cache, navega para `/dashboard` (`replace`) e exibe um toast de sucesso (`login.success.title`) com a `message` devolvida pelo BFF; sem `message`, usa `login.success.description`;
- avisos (`Alert`):
  - `?reason=expired` → sessão expirada;
  - 400/401 → e-mail ou senha incorretos (a senha é limpa);
  - 429 → muitas tentativas;
  - falha de rede ou resposta inesperada → login indisponível;
- o painel de marca e as preferências (idioma e tema) permanecem como antes.

Search params da rota validados por `loginSearchSchema` (`login.model.ts`).

### Novo cadastro

- o link `Criar conta`, abaixo do formulário de login, abre o modal `RegisterView` (`Dialog` do shadcn);
- campos: nome completo, telefone com DDD (máscara via `PhoneInput`), e-mail, senha e confirmação de senha (`PasswordInput`, com mostrar/ocultar);
- validações (`registerFormSchema` em `register.model.ts`): nome e sobrenome só com letras, espaço, apóstrofo, ponto e hífen (máx. 120); DDD existente, fixo com 10 dígitos ou celular com 11 começando com 9; e-mail válido (máx. 254, normalizado em minúsculas); senha de 8 a 64 caracteres, sem espaço nas pontas, e não pode ser **fraca**; confirmação igual à senha;
- força da senha (`src/shared/validation/password-strength.ts`): fraca, média ou forte, exibida pelo `PasswordStrengthMeter`. É fraca com menos de 8 caracteres, menos de 3 tipos de caractere (minúscula, maiúscula, número, símbolo), termos óbvios (`senha`, `qwerty`, `igreja`...), partes do nome ou do e-mail, ou sequências/repetições que derrubam a pontuação;
- o botão `Criar conta` fica desabilitado até o formulário estar válido e durante o envio; o modal fecha **somente pelo botão "X"** (Esc e clique fora são ignorados) e nunca durante o envio; não há botão Cancelar;
- 409 marca o campo de e-mail; demais falhas aparecem em `Alert` no modal;
- sucesso: o BFF já abre a sessão na resposta do cadastro (não há segunda chamada de login); o front invalida a sessão em cache e navega para `/dashboard` (`replace`), mantendo o envio travado até a navegação terminar, e exibe um toast de sucesso (`register.success.title`) com a `message` do BFF (ou `register.success.description`).

---

## 14. Layout autenticado

O shell autenticado contém:

```text
Header
├── marca associada à sidebar
├── botão hamburger
├── logo central
└── avatar com iniciais (UserMenu: nome, e-mail e Sair)

Sidebar
├── modo expanded
├── modo collapsed
├── modo hidden
├── Dashboard
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

### Celular (abaixo de `md`)

- a sidebar não aparece; o botão hamburger abre o `AppSidebarDrawer` (`Sheet` do shadcn, à esquerda);
- o drawer fecha ao navegar, ao sair, com `Esc` ou tocando fora;
- a partir de `md`, o hamburger volta a mostrar/ocultar a sidebar (modos acima);
- a marca acima da sidebar fica oculta no celular.

### Usuário

Nome, e-mail e iniciais vêm da sessão do BFF (`user.name`, `user.email`). Sem nome, o nome é derivado do e-mail (`authenticated-layout.model.ts`).

---

## 15. Dashboard

O dashboard é a página inicial autenticada, com dados mockados, servida na rota `/dashboard` (`_authenticated.dashboard.tsx`).

Nenhuma página está vinculada à rota `/` no momento. Links do layout, redirects do login e o fallback de erro apontam para `/dashboard`. As páginas públicas de status (não encontrada e em construção, via `StatusPage`) levam para a home pública `/`.

Estrutura MVVM:

```text
features/dashboard/presentation/
├── models/
│   └── dashboard.model.ts
├── view-models/
│   └── dashboard.view-model.ts
└── views/
    └── dashboard.view.tsx
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

### Dados

```text
DashboardViewModel → dashboardOverviewQueryOptions (TanStack Query) → getDashboardOverviewUseCase
  → DashboardGateway (domain/dashboard-overview.ts) → dashboardMockGateway (infrastructure/mock)
```

- os dados ainda são **mocks temporários**, agora atrás da porta `DashboardGateway`;
- quando o BFF expuser o endpoint, criar um gateway HTTP (`bffClient`) com o mesmo contrato e trocar o padrão do use case; a ViewModel e a View não mudam;
- o contrato `DashboardOverview` é provisório até o endpoint existir no BFF;
- nomes de eventos são conteúdo (não são traduzidos); tipos de atividade são traduzidos pela UI;
- a View trata carregamento (`Spinner`), erro (`Alert` com `Tentar novamente`) e listas vazias.

---

## 15.1 Organização e congregações

Feature `src/features/organization` (namespace i18n `organization`), consumindo a API de negócio do BFF, que repassa à Core API:

| Endpoint (BFF)                                         | Uso no front                                                     |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `GET/PATCH /api/v1/organization`                       | dados da Matriz; o PATCH exige `version` (concorrência otimista) |
| `POST /api/v1/organization/{activate,deactivate}`      | situação da organização                                          |
| `GET /api/v1/congregations?status&cursor`              | lista paginada por cursor (`{ items, nextCursor }`)              |
| `POST /api/v1/congregations`, `PATCH .../:id`          | registro (nasce `DRAFT`) e edição (com `version`)                |
| `POST /api/v1/congregations/:id/{activate,deactivate}` | situação da congregação                                          |

- rotas `/organizacao` e `/congregacoes`, filhas de `/_authenticated`; os itens do menu exigem e-mail verificado (o BFF responde 403 sem ele);
- toda escrita envia `X-CSRF-Token` (token da sessão em cache); erros são RFC 9457 (`detail`, `fields`) e o gateway os normaliza em erros do domínio (400 → campos marcados no formulário, 409 → conflito com o `detail` do servidor, 403/404/demais);
- conflito de versão na edição fecha o modal, avisa em toast e recarrega os dados;
- ativação/inativação passa por confirmação (`StatusChangeDialog`);
- CNPJ, CEP e UF são validados em `src/shared/validation/brazilian-address.ts`, com as mesmas regras da Core API.

---

## 15.2 Usuários

Feature `src/features/users` (namespace i18n `users`), consumindo `/api/v1/users` do BFF (gestão das contas de acesso, ADR 0008 do backend):

- rota `/usuarios` (menu "Usuários", somente com e-mail verificado): busca por nome ou e-mail (aplicada ao enviar), filtros combináveis em chips (ativas ou suspensas + verificadas ou não verificadas; "Todas" limpa os demais e não tem o "X" de remover) e paginação por cursor. Lista somente contas que ainda não viraram Pessoa (`hasPerson=false`): quem vira Pessoa e membro passa a aparecer só em Membros; datas no padrão "16/10/2026 às 16:31:28", com o momento da suspensão no badge "Suspensa";
- tabela a partir de `md` (`Table` do shadcn) com as colunas usuário, telefone, verificação do e-mail, situação, cadastro e ações (a conta logada recebe a tag "Você" ao lado da verificação); abaixo de `md`, um card por conta;
- **Novo usuário** (`UserCreateFormView`): os mesmos campos, regras (`registerFormSchema`), textos (namespace `auth`) e medidor de força de senha do cadastro da tela de login; o BFF envia o link de verificação e **não** abre sessão para a nova conta;
- **Editar** (`UserEditFormView`): nome, telefone e e-mail com as mesmas regras do cadastro; trocar o e-mail mostra um aviso e, ao salvar, a conta volta a "não verificada" com um novo link;
- ações com confirmação (`UserActionDialog`): suspender/reativar qualquer outra conta e excluir definitivamente somente conta não verificada; a própria conta ("Você") não tem essas ações;
- recusas das requests (400, 403, 404 e 409, inclusive e-mail já cadastrado) são decididas pelo BFF e exibidas em **toast** com a mensagem do servidor (`message`, lida de `error.data` do Ky 2), com texto traduzido como reserva; o formulário fica aberto para correção. O `code` estável (`email_taken`, `self_action`, `verified_account`) só escolhe o título.

---

## 15.3 Membros

Feature `src/features/members` (namespace i18n `members`), consumindo `/api/v1/members` e `/api/v1/memberships` do BFF:

- rota `/membros` (lista): busca por nome (aplicada ao enviar), filtro por situação (padrão: ativos) e por congregação (`Select`) e paginação por cursor;
- **regra em cadeia**: só vira Pessoa a conta cadastrada e com e-mail verificado, e só vira membro quem é Pessoa (ADR 0009 do backend). O membro não guarda dados pessoais: `Member.person` traz os dados da Pessoa, exibidos na lista e na ficha;
- **um membro nunca é cadastrado do zero**: o botão **Criar membro** abre o modal `MemberCreateView`, que lista somente as contas com e-mail verificado que ainda não são Pessoa (`GET /api/v1/users?emailVerified=true&hasPerson=false`, paginada). A primeira coluna tem checkbox (com "selecionar todos" no cabeçalho) e a última o botão **Vincular**, que converte só aquela conta; **Vincular todos** é liberado com mais de uma conta marcada e converte somente as marcadas (`POST /api/v1/users/members`, em lotes de até 50). Vincular cria a Pessoa (com nome, e-mail e telefone da conta) e o membro;
- depois da conversão o modal **não fecha**: mostra o toast de sucesso, de conversão parcial ou de erro, recarrega a lista de contas e volta ao estado inicial (seleção limpa). Como os demais modais, fecha somente pelo "X" (Esc e clique fora são ignorados), nunca durante a conversão, e bloqueia a aplicação enquanto aberto (foco preso no modal);
- rota `/membros/$memberId` (ficha): dados pessoais da Pessoa (somente leitura; a edição virá com a tela da Pessoa), ações de situação conforme a situação atual (ativo: inativar; inativo: ativar ou arquivar; arquivado: restaurar) e histórico de vínculos;
- vínculos: registro em modal (`MembershipFormView`, somente congregações ativas, opção de vínculo principal), ativação de pendente e encerramento; encerrado é histórico e não reabre;
- toda mudança de situação passa por `ConfirmActionDialog`; conflitos (409) mostram o `detail` do servidor (ex.: vínculo principal já ativo, vínculos abertos ao inativar);
- dados pessoais do MVP: nome completo, data de nascimento, telefone e e-mail (ADR 0009 do backend); a conta guarda o vínculo com a Pessoa (`personId`);
- a lista de congregações para escolha vem de `congregationOptionsQueryOptions` (feature organization, até 100 itens).

---

## 15.4 Galeria (álbuns)

Feature `src/features/gallery` (namespace i18n `gallery`), consumindo `/api/v1/gallery` do BFF (ADR 0010 do backend):

- rota `/site/albuns` (menu **Site → Álbuns**, somente com e-mail verificado; o grupo Site reúne as parametrizações do site público): lista paginada, mais recentes primeiro, com situação (Rascunho, Publicado, Arquivado), data e quantidade de fotos prontas; **Novo álbum** abre `AlbumFormView` (título, data do culto ou evento, descrição opcional) e o álbum criado abre direto na página dele;
- rota `/site/albuns/$albumId`: dados do álbum (com o endereço público `/fotos/{slug}`, que não muda com o título), edição em modal e a grade de fotos;
- **Adicionar fotos**: seletor múltiplo (JPEG, PNG ou WebP, até 25 MB cada). `uploadPhotosUseCase` pede as URLs ao BFF em lotes de até 50, envia cada arquivo **direto ao bucket de mídia** (área privada) (PUT pré-assinado por `XMLHttpRequest`, para ter progresso; sem cookies, com o `Content-Type` assinado), três por vez, e confirma cada envio. A falha de um arquivo não interrompe os demais; a lista de envios mostra o andamento e o motivo das falhas, e sair da página durante o envio pede confirmação do navegador;
- o processamento (variantes AVIF/WebP, remoção de metadados e GPS) é assíncrono no servidor: a grade consulta de novo a cada 3 s enquanto houver foto em processamento. As miniaturas são URLs de validade curta (1 h) e usam o placeholder borrado enquanto carregam;
- excluir foto é definitivo e passa por `DeletePhotoDialog`; os modais fecham somente pelo "X" (ou Cancelar) e nunca durante o envio;
- publicação, capa, CDN e a seção pública **Fotos** chegam na próxima etapa.

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

Clientes existentes (`src/shared/http`):

- `bffClient`: BFF, na mesma origem (`/auth/*` e `/api/v1/*`, repassadas pelo Worker/proxy do Vite); trata 401 fora de `/auth/*` como sessão expirada;
- `workerApiClient`: endpoints do próprio Worker (`/api/*`).

Regras:

- não usar `fetch` diretamente em Views;
- nunca hardcodar origem de BFF/serviço: o front chama caminhos relativos da própria origem;
- novas rotas do BFF consumidas pelo front precisam ser incluídas no proxy (Worker, `run_worker_first` e Vite);
- não introduzir Axios;
- erros devem ser normalizados no gateway antes de chegar à View;
- autenticação fica no cliente/adapters, não espalhada pelo código.

---

## 19. Environment variables

A configuração é validada por Zod em runtime.

Schema atual:

```ts
const envSchema = z.object({
  VITE_ENV: z.enum(['development', 'homologation', 'production']),
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
- `navigateFallbackDenylist` para `/api/*` e `/auth/*` (rotas do Worker e do BFF nunca recebem o `index.html`);
- `clientsClaim: true`.

### Atualização de versão

`PwaUpdatePrompt` informa que existe nova versão e oferece botão `Atualizar`.

Não mudar silenciosamente para auto-update sem decisão explícita.

### Pendência conhecida

O conjunto definitivo de ícones PWA 192/512/maskable ainda deve ser tratado quando o branding final estiver pronto.

---

## 21. Loading global

`LoadingOverlay` (`src/components/ui/loading-overlay.tsx`) é o único loading de tela cheia da aplicação. Ele:

- ocupa toda a viewport, acima de tudo (inclusive modais e toasts), com o fundo da página;
- mostra o símbolo da Viva dentro de um anel girando e o texto `common:processing` ("Processando, por favor aguarde") com pontos animados: um ponto a cada 0,5s, de 1 a 5, recomeçando;
- bloqueia **toda** interação: mouse/toque (overlay por cima), teclado (qualquer tecla é descartada), foco e leitor de tela (`inert` em todo o resto da página); mostra o cursor de espera e impede o scroll;
- anuncia o texto uma única vez ao leitor de tela (`role="status"`), sem repetir a cada ponto;
- restaura tudo ao sair; overlays simultâneos (ex.: request + troca de rota) compartilham o bloqueio e só liberam a tela quando o último sai.

### Como ativar

- em ViewModels, enquanto uma mutation estiver em andamento: `useGlobalLoading(isPending)`;
- em fluxos imperativos: `await globalLoading.run(() => tarefa())` ou `const stop = globalLoading.start(); ... stop();`;
- (`src/shared/feedback/global-loading.ts`; o organismo `GlobalLoading`, montado no `main.tsx`, exibe o overlay enquanto houver operação registrada);
- renderizar `<LoadingOverlay />` direto continua válido (ex.: `RoutePending`, login, logout, Wi-Fi).

Não criar spinners globais concorrentes.

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

### ⚠️ Regra obrigatória: testes somente sob solicitação explícita

**NUNCA criar, alterar, excluir ou executar testes sem a solicitação explícita do responsável pelo projeto.**

Isso vale para todos os tipos de teste (unitários, de componente e E2E) e para qualquer comando de teste (`pnpm test`, `pnpm test:run`, `pnpm test:coverage`, `pnpm test:e2e`, `vitest`, `playwright`).

- não criar arquivos `*.test.ts`, `*.test.tsx` ou `*.spec.ts` por iniciativa própria, nem ao criar componentes, features ou corrigir bugs;
- não ajustar testes existentes para acompanhar uma mudança de código, salvo pedido explícito; se uma mudança provavelmente quebrar testes, apenas avisar;
- não executar testes para validar alterações; a validação padrão é `pnpm quality:fix` (e `pnpm build` quando aplicável);
- "solicitação explícita" é um pedido direto para criar, alterar ou rodar testes naquela tarefa; não vale inferir a partir de "valide", "garanta que funciona" ou de checklists deste documento.

As regras abaixo descrevem **como** os testes devem ser escritos quando forem solicitados.

### Unit/component tests

Stack:

- Vitest;
- Testing Library;
- `@testing-library/jest-dom`;
- jsdom.

O setup (`src/test/setup.ts`) inicializa o i18next em pt-BR: os testes procuram os textos em português.

### Cobertura

- `pnpm test:coverage` mede todo o código de `src/` e `worker/` (não só o que os testes importam);
- os limites mínimos (`thresholds` em `vitest.config.ts`) são um piso contra regressão, a partir da medição real; subir conforme novos testes.

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
- navegador em `locale: 'pt-BR'` (a preferência de idioma padrão segue o navegador);
- trace no primeiro retry.

### Filosofia de teste

Preferir comportamento observável do usuário.

Evitar testar detalhes internos de implementação.

Ao corrigir bug relevante, sugerir um teste de regressão, mas só criá-lo se for solicitado.

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

Testes **não** fazem parte da validação padrão: só executar quando solicitado explicitamente (seção 23).

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

Fluxo obrigatório: `feat/*`, `fix/*` ou `hotfix/*` → PR para `homologation` → PR para `main`.

- nunca fazer commit ou push direto em `main` ou `homologation` (protegidas por rulesets);
- `homologation` publica HML (`https://hml.comvivaeficaz.com.br`) e `main` publica produção;
- a `main` só recebe PRs da `homologation`, com merge commit; após cada release, sincronizar a
  `main` de volta na `homologation` por PR.

### Commits

Usar Conventional Commits e commits pequenos/coerentes.

Mensagens de commit são **sempre em PT-BR**:

- o tipo (e o escopo, se houver) segue o padrão Conventional Commits em inglês: `feat`, `fix`, `refactor`, `build`, `test`, `chore`, `docs` etc.;
- a descrição, o corpo e os itens do corpo são escritos em português do Brasil;
- descrição no imperativo, iniciando em minúscula e sem ponto final;
- linhas de trailer (por exemplo, `Co-Authored-By:`) permanecem no formato original.

Exemplos:

```text
feat: adiciona fluxo de login com arquitetura MVVM
feat: adiciona autenticação local e guards de rota
feat: adiciona layout autenticado do dashboard
feat: refina o design visual do dashboard
fix: melhora os estados de cursor dos botões
build: configura o deploy no Cloudflare Workers
test: configura testes end-to-end com Playwright
chore: padroniza os finais de linha do repositório
```

Commits anteriores a esta regra estão em inglês e não devem ser reescritos.

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

O Worker em `worker/index.ts` executa **somente** para `/api/*` e `/auth/*` (`run_worker_first`); o restante continua servido como asset estático.

- `/auth/*` e `/api/v1/*`: proxy para o BFF em `BFF_ORIGIN` (secret opcional; sem ele, responde 503 `bff_not_configured`). Ver seção 12.

Uso atual: `POST /api/guest-wifi/authorize`, que libera a rede "VIVA - Visitantes" no Omada Controller (External Portal Server). A rota pública `/wifi-visitantes` (fora de qualquer menu) é o portal cativo configurado no Omada.

- credenciais do Omada ficam apenas em secrets do Worker (`pnpm exec wrangler secret put <NOME>`): `OMADA_CONTROLLER_URL`, `OMADA_CONTROLLER_ID`, `OMADA_SITE_ID`, `OMADA_OPERATOR_USERNAME`, `OMADA_OPERATOR_PASSWORD`;
- localmente, usar `.dev.vars` (não versionado; modelo em `.dev.vars.example`);
- após alterar `wrangler.jsonc`, regenerar os tipos com `pnpm exec wrangler types worker/worker-configuration.d.ts`;
- o front chama o Worker via `workerApiClient` (`src/shared/http/worker-api-client.ts`);
- se o BFF for publicado como Worker na mesma conta Cloudflare, preferir um Service Binding no lugar de `fetch` para `BFF_ORIGIN`;
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

### Foco e contraste (meta WCAG 2.2 AAA)

- **indicador de foco global** em `src/index.css` (fora de `@layer`, então prevalece sobre `outline-none`/`ring-*` dos componentes): contorno sólido de 3px (`--focus-ring`) afastado 2px, com halo de 2px na cor oposta (`--focus-ring-halo`). Contraste de 7,7:1 a 14,5:1 contra fundo, cards, modal, header e menu lateral nos dois modos (WCAG 2.4.13 AAA). Não reintroduzir anéis de foco translúcidos (`ring-ring/50`) nem remover essa regra;
- em `InputGroup` o foco contorna o grupo inteiro, não só o `input` interno;
- bordas de campo usam `border-input-border` (3:1 ou mais); texto de erro usa `text-destructive-strong` (7:1 ou mais);
- texto normal em AAA (7:1): ao criar tons novos, conferir o contraste antes de usar;
- botões desabilitados não reagem a hover/clique (estilos via `data-disabled`); um submit desabilitado que precisa ser descoberto pelo teclado usa `focusableWhenDisabled` e `aria-describedby` explicando o motivo;
- formulários: erro de campo só aparece após o envio ou ao sair de um campo preenchido (tabular por campos vazios não marca tudo como inválido); campos com `aria-required`, `aria-invalid` e `aria-describedby` apontando para o erro (`<id>-error`, gerado pelo `FormField`).

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

### Auth

A segurança da sessão é do BFF (cookie HttpOnly + CSRF). Os guards das rotas são UX/controle de navegação: toda autorização real acontece no servidor.

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
10. Criar testes somente se solicitado explicitamente (seção 23).
11. Rodar `pnpm quality:fix`.
12. Rodar build conforme impacto (testes só se solicitado).
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

- **`ui/` (átomos):** `Alert`, `Anchor`, `Box`, `Button`, `Card`, `Carousel`, `Checkbox`, `Form`, `Heading`, `Image`, `Input`, `Label`, `LoadingOverlay`, `Sheet`, `Spinner`, `Subtitle` (subtítulo padrão de telas, cards e modais; o `DialogDescription` já renderiza um `Subtitle`), `Text`, `Toast` (primitivas do toast do shadcn sobre o Base UI), `Tooltip`, `Dialog`, `Field` (`FieldGroup`, `FieldLabel`, `FieldError`...), `InputGroup`, `Progress`, `Select` (`SelectTrigger` usa `fieldControlClassName`), `Separator`, `Table` (tabelas de dados; o contêiner rola na horizontal, nunca a página). Única camada que pode usar HTML nativo.
- **`molecules/`:** `CardSectionHeader` (cabeçalho de seção de card com ícone, título e descrição), `LocaleToggle` (escolha de idioma), `PreferenceToggleGroup` (base dos seletores de preferência), `TooltipHint`, `UserMenu` (avatar com iniciais e menu da conta) (tooltip do shadcn sobre um elemento interativo), `ThemeToggle` (escolha de tema), `SidebarNavItem` (item do menu lateral com tooltip quando recolhido), `SidebarNavGroup` (grupo do menu lateral com subitens, ex.: Site → Álbuns; aberto quando a rota atual pertence a ele e, recolhido, mostra os ícones dos subitens), `StatusBadge` (situação de um registro, com tom `success`, `warning` ou `neutral`), `FormField` (rótulo, controle, descrição e erro de um campo), `PasswordInput` (senha com mostrar/ocultar), `PasswordStrengthMeter` (força da senha e requisitos), `PhoneInput` (telefone brasileiro com máscara, compatível com o `register` do RHF), `NotificationToast` (toast de sucesso/erro com contagem regressiva).

Regras de validação reutilizáveis e independentes de UI (telefone brasileiro, política de senha) ficam em `src/shared/validation`.

**Campos de formulário (padrão único):** todo controle de formulário (input, campo com botão como o de senha, select, textarea, combobox...) usa as classes de `src/components/ui/field-control.ts`: `fieldControlClassName` quando o próprio elemento é o campo e `fieldGroupClassName` quando um contêiner envolve o campo e complementos (`InputGroup`). Elas definem altura (`h-11`, alvo de toque de 44px), fundo (`input-background`), borda (`input-border`, sempre a mesma cor, inclusive no foco), raio, texto (`foreground`, que não fica vermelho quando inválido), placeholder (`placeholder`), foco, inválido e desabilitado. Não definir cor, borda ou fundo próprios em um novo controle; ao adicionar um `select` ou `textarea` do shadcn, trocar as classes geradas por essas.

- **`organisms/`:** `PublicHeader`, `AppFooter`, `AppSidebar`, `AppSidebarDrawer` (menu lateral em drawer no celular), `PreferencesControls` (idioma + tema), `PreferencesPopover` (preferências recolhidas em um botão), `StatusPage`, `Toaster` (provedor global dos toasts, montado no `main.tsx`), `GlobalLoading` (exibe o `LoadingOverlay` quando acionado por `globalLoading`/`useGlobalLoading`).

### Mensagens de retorno das requests (toast)

- ViewModels exibem o retorno de uma request com `notify.success({ title, description })` ou `notify.error({ title, description })` (`src/shared/feedback/notify.ts`), sempre com textos já traduzidos (`t(...)`); não montar toasts à mão;
- cada toast tem ícone, título, subtítulo opcional, botão de fechar ("X") e uma barra que conta de 7s até 0s (`TOAST_DURATION_MS`); ao chegar a 0s ele fecha sozinho;
- a contagem pausa com o mouse ou o foco sobre o toast e com a aba em segundo plano (WCAG 2.2.1);
- erros têm prioridade alta (anunciados na hora pelo leitor de tela) e sucesso prioridade baixa (anunciado sem interromper). Pelo padrão do Base UI, o toast de erro visível fica `aria-hidden` porque o anúncio sai por uma região `alert` própria; F6 leva o foco para os toasts;
- no máximo 3 toasts visíveis, no topo (largura total no celular, à direita a partir de `sm`);
- cores: faixa lateral e barra em `success`/`destructive`, ícone em `success-strong`/`destructive-strong`.

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

- criar, alterar, excluir ou executar testes sem solicitação explícita;
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
- guardar sessão, tokens ou dados de autenticação em localStorage/sessionStorage;
- guardar credenciais no front ou enviá-las a outro destino que não o `POST /auth/login` do BFF;
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
- [ ] Nenhum teste foi criado, alterado ou executado sem solicitação explícita?
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
DashboardViewModel → mocks locais

Futuro:
DashboardViewModel → TanStack Query / use case → repository → BFF

DashboardView → permanece majoritariamente estável
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
i18next + react-i18next com chaves tipadas (pt-BR fonte da verdade, en-US)
Nenhum texto de interface fixo no código
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
Testes só sob solicitação explícita (criar, alterar ou executar)
1 describe por arquivo de teste
1 expect por it
pnpm quality:fix como validação canônica
Git add . + Conventional Commit + push
Cloudflare Workers + Static Assets
Sem secrets em VITE_*
Auth via BFF (e-mail e senha + cookie HttpOnly), /auth/* na mesma origem
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
