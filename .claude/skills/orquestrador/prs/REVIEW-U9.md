# REVIEW-U9 — ciclo 1

**Branch:** `feat/tag-u9-fetags` · **Veredito:** APPROVE (sem crítico, 3 🟡 não-bloqueantes) · Suíte 21/21

## 🟡 (não bloqueiam)
- `TagsPage.tsx:9-15` — `toApiMessage` duplica `toMessage` de useAsync; extrair util compartilhado.
- `TagsPage.tsx:35,68` — `aria-invalid` marca qualquer createError (spec §1.2 distingue 409 de erro genérico); documentar/separar.
- `TagsPage.test.tsx:80` — teste 409 não força `status:409` no mock; incluir p/ aderência.

## 🟢
- Cliente fino idêntico ao padrão; `tag.name` texto puro (sem XSS); validação trim sem maxlength (spec §1.2); lista na ordem do backend; testes citam regras isolados.

**Merge:** `b08184f` (--no-ff).

<!-- VERDICT: APPROVE -->
