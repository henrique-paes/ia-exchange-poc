---
name: tag-book-relation-decisions
description: Decisoes de design para a relacao Tag <-> Book (endpoints, filtro, update)
metadata:
  type: project
---

- PATCH /books/:id e update parcial: omitir tagIds nao altera tags; enviar [] limpa todas.
- Filtro de books por tags usa params repetidos: GET /books?tagIds=a&tagIds=b (semantica AND/match-all).
- Tags nao sao auto-criadas pelo fluxo de book; devem existir antes de serem vinculadas.
- POST /tags retorna 409 (conflict) em nome duplicado case-insensitive.
- tagIds com id inexistente em create/update de book retorna 404 (not_found).
- Book retornado sempre inclui tags: Tag[] hidratadas (id, name, createdAt).
- resetDb ordem FK-safe: rentals → books → tags → users. Com relacao implicita _BookToTag + CASCADE deletes, deletar book/tag desconecta a juncao automaticamente sem precisar limpar a tabela de juncao manualmente.
- Migration implicita gera _BookToTag com ON DELETE CASCADE em ambas as FKs; unicidade de (A,B) garantida por _BookToTag_AB_unique index.
- tag.name.unique e regra de aplicacao (case-insensitive) — NAO colocar unique index nativo no Prisma para name; validar no service.
- frontend/src/api/types.ts ja tem Tag exportada e Book.tags: Tag[] (adicionado em T17/U8). Mocks em BooksPage.test e RentalsPage.test precisam de tags: [] para compilar.
- Build local vite falha com SyntaxError ??= por Node antigo no PATH; tsc --noEmit e o passo tsc -b passam normalmente. Usar docker para o build vite completo.
- Tag module (U3/T3-T7) entregue em feat/tag-u3-tagmodule; ConflictError ja existia em AppError.ts com status 409 — nao precisou ser criado.
- Teste local (cd backend && npm test) falha com "Cannot find module 'node:path'" por Node antigo no PATH. Sempre usar docker compose exec -T backend npm test.
- Seed idempotente confirmado: docker compose exec -T backend npm run seed (chama ts-node prisma/seed.ts). Ordem de deleteMany: rentals → books → tags → users.
- _BookToTag: coluna A = Book.id, coluna B = Tag.id (ordem inversa ao que intuitivamente se esperaria de "BookToTag"). Verificado em producao.
- BookRepository.update: usa tags: { set: [...] } para substituir o set completo; omitir tagIds no updateData (sem spread da chave) evita tocar as tags (book.tags.set).
- BookWithTags = Book & { tags: Tag[] } exportado de book.repository.ts; BookService.create/getById/update/list todos retornam BookWithTags.
- rental.service.test.ts fakeBooks usa BookService como unknown cast; list: jest.fn() sem impl — adicionar param opcional ao list() nao quebra o fake.
- updateBookSchema usa .refine(() => Object.keys(data).length > 0) para validar book.update.noFields; funciona pois campos undefined sao excluidos por Zod antes do refine.
- Query param tagIds em GET /books: controller normaliza string|string[] de qs, filtra nao-strings (guard vs ?tagIds[a]=b), valida cada item com z.string().uuid() — retorna 400 se invalido. IDs desconhecidos nao erram (apenas nao casam). Padrao a reutilizar em outros endpoints com array query params.
- Imports em testes: sempre usar ES import no topo do arquivo; require() no meio do arquivo e antipadrao — gera aviso do revisor.
- TagsPage (U9/T18-T21) entregue em feat/tag-u9-fetags. Field+Input+errorText de field.module.css cobrem o padrao de erro inline 409. toApiMessage extrai axiosErr.response.data.error.message — mesmo padrao de toMessage em useAsync.ts.
- App.test.tsx PRECISA de mock de api/tags pois BooksPage (montada na rota default) chama useAsync(listTags, []) — sem o mock, dispara chamada real + warning act.
- Padrao de nav link em Layout.tsx: const linkClass = ({isActive}) => isActive ? s.link + s.active : s.link — aplicar identico para novas rotas.
- TagPicker (U10/T23) usa fieldset+legend+checkboxes; aria-label no fieldset e o selector de teste via getByRole('group', { name: 'book tags' }) ou 'filter by tags'.
- listBooks no frontend serializa tagIds como query string manual: tagIds.map(id => `tagIds=${encodeURIComponent(id)}`).join('&') — nao altera client.ts globalmente.
- useAsync com deps dinamicos: passar [filterTagIds.join(',')] em vez de [filterTagIds] para evitar re-render por referencia de array nova.
- BooksPage.module.css criado para .tagPills + .tagPill (pills de tag em linhas de book, separado de StatusPill que tem semantica de disponibilidade).
- Para suprimir warning act() em App.test.tsx: usar await act(async () => { render(<App />) }) + mock de todas as apis chamadas por BooksPage (listBooks, listUsers, listTags). O act async aguarda resolucao das microtasks (promises mockadas com mockResolvedValue).
- Padrao de mock em BooksPage.test: vi.mock('../api/tags', () => ({ listTags: vi.fn(), createTag: vi.fn() })) necessario quando BooksPage monta TagPicker que usa listTags via prop (tags.data).
