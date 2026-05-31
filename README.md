# Code & Coffee | Cardápio Digital

Este é o projeto integrador de um cardápio digital dinâmico e responsivo para a cafeteria **Code&Coffee**. A aplicação é full-stack, desenvolvida com backend em Node.js/Express, persistência no banco de dados MongoDB (usando Mongoose) e uma interface frontend elegante construída em HTML5 semântico, Vanilla CSS e Vanilla JavaScript.

## Integrantes
- **Kevin Nikolai Oliveira Veidembaum** (Desenvolvedor Full-Stack)
- **João Pedro Cyrineu** (Desenvolvedor Front-End)
- **Thales de Barros Müzel** (Desenvolvedor Back-end)
- **Weslley Caetano Soares** (Líder Técnico)

## Tecnologias

- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT (JSON Web Tokens), bcryptjs
- **Frontend**: HTML5 Semântico, CSS3 Moderno (Custom Variables, Mobile-First, Flexbox/Grid), JavaScript Vanilla (manipulação do DOM, Fetch API)
- **Segurança**: Autenticação de usuários baseada em sessões JWT e hash de senhas.

## Como rodar

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

1. **Node.js** (versão 16+)
2. **MongoDB** rodando localmente na porta padrão (`27017`) ou uma URI do MongoDB Atlas.

### Passo a Passo

1. **Clonar o Repositório**:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd codeAndCoffee
   ```

2. **Instalar Dependências**:

   ```bash
   npm install
   ```

3. **Subir o Banco de Dados (Docker)**:
   Caso tenha o Docker instalado, inicie uma instância local do MongoDB rodando:

   ```bash
   docker compose up -d
   ```

4. **Configurar as Variáveis de Ambiente**:
   Copie o arquivo `.env.example` para `.env`:

   ```bash
   cp .env.example .env
   ```

   *Nota: O arquivo `.env` já vem pré-configurado por padrão para conectar no MongoDB local do Docker (`mongodb://127.0.0.1:27017/codeAndCoffee`). Se necessário, altere as variáveis de conexão e a chave secreta JWT.*

5. **Popular o Banco de Dados (Seed)**:
   Popule o banco de dados com os produtos iniciais temáticos de programação rodando:

   ```bash
   npm run seed
   ```

6. **Rodar a Aplicação**:
   Para iniciar em modo de desenvolvimento (com recarga automática do Nodemon):

   ```bash
   npm run dev
   ```

   Para rodar em modo de produção:

   ```bash
   npm start
   ```

7. **Acessar**:
   Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

---

## Endpoints da API

| Método | Rota | Descrição | Autenticação (Auth) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/registrar` | Registra uma nova conta no sistema | Não |
| `POST` | `/api/auth/login` | Realiza login e retorna token JWT | Não |
| `POST` | `/api/auth/registrar-admin` | Cadastra um novo administrador no sistema | Sim (Apenas Admin) |
| `GET` | `/api/produtos` | Lista todos os produtos (filtros por query) | Não |
| `GET` | `/api/produtos/:id` | Retorna os detalhes de um produto | Não |
| `POST` | `/api/produtos` | Cadastra um novo produto | Sim (Apenas Admin) |
| `PUT` | `/api/produtos/:id` | Edita dados de um produto existente | Sim (Apenas Admin) |
| `DELETE` | `/api/produtos/:id` | Exclui um produto do banco de dados | Sim (Apenas Admin) |
| `POST` | `/api/pedidos` | Cria um novo pedido para o usuário logado | Sim |
| `GET` | `/api/pedidos` | Lista histórico de pedidos do cliente logado | Sim |
| `GET` | `/api/pedidos?todos=true` | Admin gerencia todos os pedidos do sistema | Sim (Apenas Admin) |
| `PATCH` | `/api/pedidos/:id` | Atualiza o status de um pedido | Sim (Apenas Admin) |

---

## Deploy

Link para a aplicação publicada: *[code-and-coffee-ten.vercel.app]*
