# Spec: UI Tags

Minimal UI covering the Tags page and tag-related controls on the Books pages.
All styling uses tokens from [`ui-style.md`](./ui-style.md); all component rules
from [`ui-components.md`](./ui-components.md). Domain rules trace to
[`tag.md`](./tag.md).

---

## 1. Página Tags (`/tags`)

### 1.1 Estrutura geral

- Título de página: "Tags" (`--text-xl`, `--font-bold`).
- Layout: coluna única, `max-width: var(--container)`, gutters `--space-5`.
- Seções, de cima para baixo:
  1. Formulário de criação (sempre visível).
  2. Lista de tags existentes.

### 1.2 Formulário de criação

Traces: `tag.create`, `tag.name.required`, `tag.name.length`, `tag.name.unique`.

Campo:

| Elemento | Regra |
|---|---|
| `<label>` | Texto "Tag name"; `for` associado ao input. |
| `<input type="text">` | `aria-label="tag name"`; placeholder "e.g. Sci-Fi"; `maxlength="40"`. |
| Botão "Create tag" | `variant=primary`; min-height 40px (hit target `ui-components.md §Button`). |

Estados do botão:

- **Desabilitado** (`disabled` nativo, `opacity:.5`, `cursor:not-allowed`) quando:
  - campo vazio ou contém apenas espaços (traça `tag.name.required`), **ou**
  - comprimento após trim > 40 chars (traça `tag.name.length`), **ou**
  - submissão em andamento.
- **Habilitado** apenas com valor válido e formulário ocioso.

Tratamento de erros (resposta da API):

- **409 Conflict** (traça `tag.name.unique`): exibir abaixo do input a mensagem
  retornada pela API, na cor `--color-danger`, `--text-xs`. Input recebe
  `aria-invalid="true"` e borda `--color-danger` (regra `ui-components.md §Input`).
- Outros erros de rede/servidor: exibir mensagem de erro genérica com `role="alert"`.

Após criação bem-sucedida:

- Limpar o campo.
- Atualizar a lista sem reload de página.

### 1.3 Lista de tags

Traces: `tag.list` (ordenada por `name` ascending).

- A lista é sempre ordenada por `name` ascending, conforme retornado pelo backend
  (`tag.list`).
- Cada item da lista é um card (`ui-components.md §List/Card`): exibe `tag.name`
  como texto primário (`--color-text`) e `createdAt` formatado como texto secundário
  (`--color-text-muted`, `--text-sm`).
- Hover: `--shadow-md` + `--color-surface-alt` (regra `ui-components.md §List/Card`).

Estado vazio (traça `tag.list` retornando `[]`):

- Exibir mensagem amigável, e.g. "No tags yet. Create your first tag above."
- Container com `--space-6` de padding, texto `--color-text-muted`.
- Não exibir área em branco sem mensagem (regra `ui-components.md §List/Card`).

Estado de carregamento / erro:

- Loading: `role="status"`, texto/spinner muted, sem layout shift
  (`ui-components.md §Loading & Error states`).
- Erro: `role="alert"`, `--color-danger`, mensagem da API, botão Retry ghost
  (`ui-components.md §Loading & Error states`).

---

## 2. Seletor de tags no formulário de criação de Book

Traces: `book.tags.optional`, `book.tags.exists`, `book.tags.unique`.

### 2.1 Controle

- Seletor multi-seleção de tags; `aria-label="book tags"`.
- Lista de opções populada pelo endpoint `tag.list` (nome + id).
- Permite selecionar 0..N tags; nenhuma seleção é válida (`book.tags.optional`).
- IDs duplicados dentro da mesma seleção são descartados silenciosamente pelo
  backend (`book.tags.unique`), portanto a UI não precisa impedir seleção dupla,
  mas deve evitar exibir opções duplicadas na lista.
- O payload enviado inclui `tagIds: string[]` com os ids selecionados (ou `[]` /
  omitido se nenhuma tag selecionada).

### 2.2 Acessibilidade

- `<label>` ou `aria-label="book tags"` associado ao controle.
- Foco visível: `outline: 2px solid var(--color-focus); outline-offset: 2px`
  (`ui-style.md §Accessibility`).
- Hit target ≥ 40×40px para cada opção/controle interativo.

### 2.3 Validação

- Se o servidor retornar 404 referente a um `tagId` desconhecido
  (`book.tags.exists`): exibir mensagem de erro abaixo do seletor.
- Não bloquear o submit pelo id desconhecido no frontend (a validação de existência
  é responsabilidade do backend).

---

## 3. Seletor de tags no formulário de edição de Book (PATCH parcial)

Traces: `book.tags.set`, `book.update`.

### 3.1 Comportamento

- O formulário de edição carrega as tags atuais do book (`tags: Tag[]` retornadas
  pelo `book.getById`) e pré-seleciona os ids correspondentes no seletor.
- Ao submeter:
  - Se o usuário alterou as tags: enviar `tagIds` com os ids selecionados
    (pode ser `[]` para limpar, traça `book.tags.set` — substituição completa).
  - Se o usuário **não** alterou as tags: pode omitir `tagIds` do payload (traça
    `book.tags.set` — omitir deixa as tags inalteradas).
- Enviar `[]` no payload limpa todas as tags do book (`book.tags.set`).

### 3.2 Estados e acessibilidade

- Mesmas regras de acessibilidade do §2.2.
- Estado de carregamento inicial (enquanto busca o book para pré-popular): exibe
  seletor desabilitado ou placeholder "Loading tags…" com `role="status"`.

---

## 4. Exibição de tags nos cards de Book

Traces: `book.list`, `book.getById` (ambos retornam `tags: Tag[]`).

### 4.1 Pills/labels

- As tags de um book são exibidas como **pills** dentro do card/linha do book.
- Estilo: `--radius-pill`, padding `--space-1` `--space-3`, `--text-xs`,
  `--font-medium`, cor de fundo `--color-surface-alt`, texto `--color-text-muted`
  (diferente das status pills de disponibilidade para não confundir semânticas).
- Cada pill exibe o `tag.name`.
- Se o book não tiver tags: não exibir nenhum pill (área fica vazia); não exibir
  placeholder de tag.

### 4.2 Ordenação das pills

- Pills exibidas na ordem retornada pela API (que é a ordem do array `tags` do
  book). Nenhuma ordenação adicional na UI é necessária.

---

## 5. Filtro de books por tags (página Books)

Traces: `book.filterByTags`, semântica AND/match-all, params repetidos.

### 5.1 Controle de filtro

- Controle multi-seleção de tags para filtrar a listagem; `aria-label="filter by tags"`.
- Lista de opções populada por `tag.list`.
- Permite selecionar 0..N tags.

### 5.2 Comportamento

- **Filtro vazio** (nenhuma tag selecionada): exibir todos os books (traça
  `book.filterByTags` — sem filtro retorna todos).
- **Com tags selecionadas**: exibir apenas books que possuam **todas** as tags
  selecionadas (semântica AND/match-all, traça `book.filterByTags`).
- A seleção de filtro é refletida nos query params da URL como params repetidos:
  `?tagIds=<id1>&tagIds=<id2>` (traça decisão de design documentada em
  `tag-book-relation-decisions.md`).
- Ao carregar a página com `?tagIds=…` na URL, o seletor de filtro deve ser
  pré-populado com os ids correspondentes.
- **IDs desconhecidos** nos query params: não geram erro na UI; simplesmente não
  correspondem a nenhum book (traça `book.filterByTags` — ids desconhecidos não
  erram).
- O filtro é aplicado de forma reativa: mudar a seleção atualiza a lista e a URL
  sem reload de página.

### 5.3 Integração com a listagem

- A listagem de books já exibe as pills de tags de cada item (§4).
- O estado de loading e erro do filtro segue as regras de `AsyncBoundary`
  (`ui-components.md §Loading & Error states`).

---

## 6. Acessibilidade — resumo de aria-labels estáveis

Estes valores são estáveis e devem ser usados nos testes de UI para localizar
controles sem depender de seletores CSS/estruturais:

| Controle | `aria-label` |
|---|---|
| Input de nome de tag (página Tags) | `"tag name"` |
| Seletor de tags no create/edit de book | `"book tags"` |
| Seletor de filtro de tags na listagem de books | `"filter by tags"` |

Regras gerais (traçam `ui-style.md §Accessibility` e `ui-components.md §Acceptance`):

- Todo controle interativo tem `<label>` visível ou `aria-label`.
- Foco visível em todo elemento interativo: `outline: 2px solid var(--color-focus);
  outline-offset: 2px`. Nunca remover sem substituto.
- Hit target ≥ 40×40px em botões e controles (`ui-components.md §Button`).
- Não codificar significado apenas por cor — pills de tag exibem o nome da tag,
  não apenas cor.
- Respeitar `prefers-reduced-motion: reduce` desabilitando transições não
  essenciais (`ui-style.md §Motion & layout`).

---

## Acceptance

- [ ] Página Tags lista tags ordenadas por nome asc (`tag.list`); estado vazio
      exibe mensagem amigável.
- [ ] Formulário de criação: botão desabilitado com campo inválido/vazio/em
      submissão (`tag.name.required`, `tag.name.length`).
- [ ] Erro 409 exibido como mensagem abaixo do input com texto da API
      (`tag.name.unique`).
- [ ] Seletor de tags em create/edit de book (`aria-label="book tags"`) permite
      multi-seleção 0..N (`book.tags.optional`).
- [ ] Edit de book pré-popula tags atuais; enviar `[]` limpa as tags
      (`book.tags.set`).
- [ ] Tags de cada book exibidas como pills nos cards/listagem.
- [ ] Filtro por tags (`aria-label="filter by tags"`) usa semântica AND e reflete
      `?tagIds=a&tagIds=b` na URL (`book.filterByTags`).
- [ ] Filtro vazio retorna todos os books; ids desconhecidos na URL não erram.
- [ ] Todos os controles têm `aria-label` estável, foco visível e hit target ≥ 40px.
