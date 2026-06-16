# Fonte da verdade: convenção de filtro por tags (params repetidos)

A semântica de filtro `GET /books` por tags (`?tagIds=a&tagIds=b`, AND/match-all,
ids desconhecidos não erram) é documentada em docs/specs/tag.md §"Filtering books
by tags" (book.filterByTags), docs/specs/api.md (GET /books) e docs/specs/book.md.
NÃO existe arquivo `tag-book-relation-decisions.md` — specs que tracem para ele
têm referência quebrada (achado). Aponte para tag.md/api.md/book.md.
