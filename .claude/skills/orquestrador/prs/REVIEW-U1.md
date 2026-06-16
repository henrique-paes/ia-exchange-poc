# REVIEW-U1 — ciclo 1

**Branch:** `feat/tag-u1-specs` · **Veredito:** REQUEST CHANGES (sem crítico; 3 🟡)

## 🟡 Sugestões exigidas
1. `book.tags.unique` (dedupe de ids em `tagIds`) não derivado em book.md/api.md.
2. book.md:25 — equivalência `omitido ≡ []` no **create** pouco explícita (no update difere: omitir preserva, `[]` limpa).
3. api.md:41 — filtro: comportamento de `tagIds` malformado/não-uuid não documentado.

## 🟢 Positivos
Tabela de erros por endpoint; PATCH parcial preciso; filtro AND/match-all fiel; cross-ref a tag.md; sem PII.

## Ciclo 2 (re-revisão após `12b016a`)
3 achados endereçados e coerentes com tag.md. 2 🟡 remanescentes cosméticos (âncora de referência), não bloqueiam. Sem crítico.

**Merge:** `c45454b` (--no-ff) em feat/agents-poc.

<!-- VERDICT: APPROVE -->
