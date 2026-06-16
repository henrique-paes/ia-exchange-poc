# Convenção: filtro de books por tags

O filtro de `GET /books` por tags usa query params repetidos
(`?tagIds=a&tagIds=b`) com semântica AND/match-all: retorna apenas books que
possuem TODAS as tags informadas. Ids desconhecidos não geram erro, apenas não
casam. Fonte da verdade: docs/specs/tag.md §"Filtering books by tags".
