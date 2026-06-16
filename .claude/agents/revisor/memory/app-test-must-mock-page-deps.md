# App.test.tsx deve mockar TODAS as APIs que as páginas renderizadas chamam

App.test.tsx renderiza <App/>, que monta BooksPage (rota default /books). BooksPage
usa useAsync(listTags, []) → chamada real de rede se ../api/tags não for mockado.
Sintoma: warning "An update to BooksPage inside a test was not wrapped in act(...)"
no output da suíte e tentativa de GET real a VITE_API_URL durante teste unitário.
Ao adicionar nova chamada de API em qualquer página, atualizar os mocks de
App.test.tsx também (mock + mockResolvedValue). Não é cosmético: quebra isolamento.
