# Convenção: relação m2m implícita Book<->Tag

A relação many-to-many entre Book e Tag é implícita no Prisma (tabela de junção
`_BookToTag`, colunas A=Book / B=Tag por ordem alfabética). Ambas as FKs da junção
usam ON DELETE CASCADE, então deletar um book ou uma tag remove os links sem deixar
órfãos (atende docs/specs/tag.md Notes). Unicidade case-insensitive de `tag.name` é
do service, NÃO do banco — não cobrar índice UNIQUE nativo em `name`.
