# PR-U7 — docs(spec): add minimal tags UI spec (T16)

- **Branch:** `feat/tag-u7-uispec` ← `feat/agents-poc`
- **Commit:** `d53f41e docs(spec): add minimal tags UI spec (T16)`
- **Tarefa:** T16 · **Camada:** spec (UI)

## Arquivo
- `docs/specs/ui-tags.md` (novo)

## Conteúdo
- §1 Página Tags: listar (name asc, `tag.list`), criar (`tag.name.required/length/unique`, 409), estado vazio.
- §2/§3 Books: seletor multi `tagIds` no create + edit PATCH (`book.tags.set`).
- §4 pills de tags por book; §5 filtro AND/match-all params repetidos (`book.filterByTags`).
- §6 a11y: aria-labels estáveis `tag name`, `book tags`, `filter by tags`; foco; hit target.

## Testes
N/A (doc).

## Critério de aceite
Atendido — cada comportamento de UI rastreia regra de `tag.md`/`ui-components.md`.
