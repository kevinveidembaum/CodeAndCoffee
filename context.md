# Projeto Integrador

Objetivo
O que e o Projeto Integrador?
Aplicacao real
▸
Criar uma aplicacao web completa (full-stack)
▸
▸
Trabalho em equipe (2 a 4 integrantes)
▸
Simular um ambiente profissional de desenvolvimento

## O que o projeto precisa ter

Front-end
▸ HTML semantico
▸ CSS responsivo (mobile first)
▸ JavaScript com DOM
▸ Consumo da API via fetch
▸ Feedback visual (loading, erros)

Back-end
▸ Node.js + Express
▸ API REST (min. 1 CRUD)
▸ MongoDB + Mongoose
▸ Autenticacao JWT
▸ Validacoes e error handler

Infraestrutura
▸ Repositorio no GitHub
▸ README documentado
▸ Deploy na Vercel
▸ Variaveis de ambiente (.env)
▸ .gitignore configurado

## Ideia a desenvolver

Cardapio digital da Cafeteria Code&Coffee
Restaurante com cardapio online, categorias, pedidos, e painel de administracao.

## Sempre documentar sobre o projeto

Documento de escopo (o que entregar)
Informacoes do projeto
▸ Nome do projeto
▸ Descricao (1 paragrafo)
▸ Integrantes (nome, funcao)
▸ Problema que resolve
▸ Publico-alvo
Funcionalidades
▸ Lista de funcionalidades (MVP)
▸ Quais paginas/telas
▸ Quais endpoints da API
▸ Quais collections no MongoDB
▸ Recursos extras (se der tempo)

## Estrutura base

Estrutura recomendada
meu-projeto/
  controllers/
    authController.js
    [recurso]Controller.js
  middleware/
    auth.js
    errorHandler.js
  models/
    Usuario.js
    [Recurso].js
  routes/
    authRoutes.js
    [recurso]Routes.js
  public/
    index.html
    css/style.css
    js/app.js
  index.js
  package.json
  .env
  .gitignore
  README.md

## Checklist inicial

▸
Criar repositorio no GitHub
▸
npm init -y
▸
Instalar dependencias (express, mongoose, etc.)
▸
Configurar .gitignore e .env
▸
Criar index.js com conexao ao MongoDB
▸
Criar model de Usuario com auth
▸
Testar com Thunder Client
▸
Primeiro commit + push

## Criterios de avaliação

### Funcionalidade (40%)

▸
CRUD completo funcionando
▸
Autenticacao implementada
▸
Front-end consumindo a API
▸
Validacoes e tratamento de erro

### Codigo (25%)

▸
Organizacao MVC
▸
Codigo limpo e legivel
▸
Boas praticas (async/await, .env)

### Interface (20%)

▸
Design responsivo
▸
Experiencia do usuario (UX)
▸
Feedback visual (loading, mensagens)

### Apresentacao (15%)

▸
Demonstracao funcional
▸
README documentado
▸
Deploy online
▸
Participacao de todos os membros

## Template do README

```markdown
# Nome do Projeto

Descricao curta do projeto.

## Integrantes
- Nome 1 (funcao)
- Nome 2 (funcao)

## Tecnologias
- Node.js, Express, MongoDB, JWT
- HTML, CSS, JavaScript

## Como rodar
1. Clone o repo: `git clone URL`
2. Instale: `npm install`
3. Configure o `.env` (ver `.env.example`)
4. Rode: `npm run dev`
5. Acesse: `http://localhost:3000`

## Endpoints da API
| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| POST   | /api/auth/registrar | Criar conta | Nao |
| ...    | ...  | ...       | ...  |

## Deploy
Link: https://meu-projeto.vercel.app
```
