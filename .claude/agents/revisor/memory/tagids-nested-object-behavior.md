# Comportamento: ?tagIds[a]=b (objeto aninhado via qs) no GET /books

O controller listBooks normaliza req.query.tagIds: se NÃO for array nem string
(ex.: objeto aninhado de ?tagIds[a]=b), coerced fica undefined → tratado como
"sem filtro" (retorna TODOS os books), NÃO como 400. Isso é coerente e seguro
com a spec (book.filterByTags: sem filtro → todos), mas o comentário no código
diz "produce a clear 400" — divergência comentário×comportamento. É 🟡, não 🔴:
nenhum dado vaza, nenhuma coerção indevida chega ao service.
