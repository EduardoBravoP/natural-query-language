export const systemPrompt = `
  Você é um assistente de dados que pode executar queries no banco de dados e retornar os resultados em formato JSON. Responda apenas a pergunta solicitada.
`.trim();

export const postgresPrompt = `
Esta ferramenta executa consultas SQL no PostgreSQL da livraria.
Use parâmetros numerados ($1, $2, etc) para valores dinâmicos ao invés de interpolação de string.
Faça apenas query de leitura no PostgreSQL. Não altere dados no PostgreSQL.

Estrutura do Banco de Dados:
Tabela: users
  id (UUID): Identificador único do usuário (chave primária)
  name (VARCHAR): Nome completo do usuário
  email (VARCHAR): Email do usuário (único)
  password (VARCHAR): Hash da senha do usuário
  created_at (TIMESTAMP): Data e hora do cadastro
  phone (VARCHAR): Número de telefone (opcional)

Tabela: books
  id (UUID): Identificador único do livro (chave primária)
  title (VARCHAR): Título do livro
  author (VARCHAR): Nome do autor
  publisher (VARCHAR): Nome da editora
  publication_year (INTEGER): Ano de publicação
  price (DECIMAL): Preço atual do livro
  stock_quantity (INTEGER): Quantidade disponível em estoque
  genre (VARCHAR): Gênero literário

Tabela: purchases
  id (UUID): Identificador único da compra (chave primária)
  user_id (UUID): ID do usuário que realizou a compra (chave estrangeira -> users.id)
  purchase_date (TIMESTAMP): Data e hora da realização da compra
  total_amount (DECIMAL): Valor total da compra

Tabela: purchase_items
  id (UUID): Identificador único do item (chave primária)
  purchase_id (UUID): ID da compra (chave estrangeira -> purchases.id)
  book_id (UUID): ID do livro (chave estrangeira -> books.id)
  quantity (INTEGER): Quantidade de unidades do livro
  unit_price (DECIMAL): Preço unitário do livro no momento da compra

Exemplos de Queries:
1. Buscar livros por gênero:
   SELECT * FROM books WHERE genre = $1

3. Histórico de compras de um usuário:
   SELECT b.title, pi.quantity, pi.unit_price, p.purchase_date
   FROM purchases p
   JOIN purchase_items pi ON pi.purchase_id = p.id
   JOIN books b ON b.id = pi.book_id
   WHERE p.user_id = $1
   ORDER BY p.purchase_date DESC`.trim();

export const redisPrompt = `
Esta ferramenta executa comandos no Redis da livraria.
Use os comandos Redis nativos em maiúsculo.
Faça apenas query de leitura no Redis. Não altere dados no Redis.

Estruturas disponíveis:

1. Contador de Livros por Usuário
   - Chave: user:{id}:book_count
   - Tipo: String (contador numérico)
   - Comandos: 
     * GET user:{id}:book_count

2. Ranking de Compradores
   - Chave: ranking:top_buyers
   - Tipo: Sorted Set
   - Score: número total de livros comprados
   - Valor: ID do usuário
   - Comandos:
     * ZRANGE ranking:top_buyers 0 -1 WITHSCORES - ranking em ordem crescente
     * ZRANGE ranking:top_buyers 0 -1 REV WITHSCORES - ranking em ordem decrescente
     * ZSCORE ranking:top_buyers {userId} - obter score específico

Exemplos de Uso:
1. Obter top 5 compradores:
   ZRANGE ranking:top_buyers 0 4 REV WITHSCORES

3. Obter total de livros comprados:
   GET user:123:book_count`.trim();