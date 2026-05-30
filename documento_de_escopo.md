# Documento de Escopo do Projeto: Cardápio Digital Code&Coffee

Este documento serve como registro oficial de escopo e entrega para a avaliação do Projeto Integrador da cafeteria **Code&Coffee**. Ele detalha os objetivos, público-alvo, modelagem de dados, endpoints da API e os recursos avançados desenvolvidos para o sistema.

---

## 1. Informações do Projeto

### Nome do Projeto

Cardápio Digital Code&Coffee

### Descrição

O **Cardápio Digital Code&Coffee** é uma aplicação web full-stack desenvolvida para modernizar e agilizar o processo de pedidos em uma cafeteria temática de tecnologia. O sistema permite que clientes naveguem de forma interativa por produtos divididos em categorias, montem um carrinho dinâmico, configurem entrega ou retirada e façam login seguro para submeter pedidos. Para os operadores do estabelecimento, a plataforma fornece um painel administrativo com controle total do cardápio, acompanhamento de pedidos por meio de um quadro Kanban interativo e um painel de métricas analíticas em tempo real.

### Integrantes

* **Kevin Nikolai Oliveira Veidembaum** (Desenvolvedor Full-Stack)
* *(Adicione o nome dos outros integrantes do seu grupo aqui)*

### Problema que Resolve

Minimiza as filas físicas nos caixas e balcões da cafeteria nos horários de pico, elimina erros de comunicação humana na anotação de pedidos e agiliza a preparação e entrega dos itens pela cozinha por meio de um fluxo de status digital organizado.

### Público-Alvo

* **Clientes**: Pessoas que frequentam cafeterias, entusiastas de tecnologia e consumidores que buscam a comodidade de realizar seus pedidos diretamente pelo celular (autoatendimento).
* **Administradores / Baristas**: Equipe interna da cafeteria responsável por cadastrar produtos, gerenciar estoques, preparar pedidos e analisar o faturamento do dia.

---

## 2. Funcionalidades (MVP)

* **Catálogo de Produtos Dinâmico**: Visualização e filtragem instantânea de itens por categorias (Cafés, Bebidas Geladas, Acompanhamentos e Sobremesas).
* **Autenticação JWT Segura**: Registro e login de usuários com senhas criptografadas usando hash `bcrypt`.
* **Carrinho Individual Persistido**: Carrinho de compras isolado por usuário no `localStorage` que sincroniza automaticamente no login/logout.
* **Histórico de Pedidos**: Área reservada para o cliente visualizar o progresso e detalhes dos seus pedidos anteriores.
* **CRUD Administrativo de Produtos**: Painel para criação, edição de preços e dados, e inativação de produtos no cardápio de forma visual.
* **Kanban de Produção da Cozinha**: Divisão visual dos pedidos em colunas de status operacionais para avanço rápido.

---

## 3. Páginas e Telas

A aplicação foi desenvolvida no formato de **SPA (Single Page Application)** unificada na pasta `public/` para uma transição suave entre telas sem recarregar o navegador:

1. **Cardápio Principal (Home)**: Exibição em grid dos produtos com fotos de fallback, botões de adicionar ao carrinho e filtros de categoria.
2. **Gaveta Lateral do Carrinho (Cart Drawer)**: Listagem dos itens selecionados, manipulação de quantidade em tempo real e campo de observações para a cozinha.
3. **Modal de Login / Registro**: Interface de autenticação com abas alternáveis para usuários e administradores.
4. **Modal de Checkout em 3 Etapas**:
   * **Etapa 1 (Entrega)**: Seleção entre retirar na loja ou receber em domicílio (abre formulário de endereço obrigatório e adiciona frete fixo de R$ 5,00).
   * **Etapa 2 (Pagamento)**: Seleção visual do método (Pix, Cartão ou Dinheiro).
   * **Etapa 3 (Confirmação)**: Revisão geral de itens, frete, taxas, endereço e total a pagar antes da finalização.
5. **Acompanhamento de Pedidos (Cliente)**: Visualização em cartões estilizados de todos os pedidos realizados pelo usuário, indicando a data, hora, itens, forma de pagamento e status de preparo.
6. **Painel do Administrador (Admin Dashboard)**: Protegido por rota segura e perfil admin, contendo três abas:
   * **Produtos**: Tabela administrativa para gerenciamento rápido (adicionar, editar e remover produtos).
   * **Gerenciar Pedidos**: Quadro Kanban operacional com quatro colunas (*Pendentes*, *Em Preparo*, *Prontos* e *Finalizados*) e botões de ação rápida.
   * **Métricas**: Painel de relatórios estatísticos de desempenho.

---

## 4. Endpoints da API REST

| Método | Rota | Descrição | Autenticação / Autorização |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/registrar` | Registra novos usuários de perfil cliente | Livre |
| `POST` | `/api/auth/login` | Autentica o usuário e gera o token de sessão JWT | Livre |
| `POST` | `/api/auth/registrar-admin` | Cadastra novos administradores no sistema | Autenticado (Apenas Admin) |
| `GET` | `/api/produtos` | Retorna a lista de produtos (aceita filtros por query) | Livre |
| `GET` | `/api/produtos/:id` | Detalhes de um produto específico | Livre |
| `POST` | `/api/produtos` | Insere um novo produto no cardápio | Autenticado (Apenas Admin) |
| `PUT` | `/api/produtos/:id` | Atualiza os dados de um produto | Autenticado (Apenas Admin) |
| `DELETE` | `/api/produtos/:id` | Exclui definitivamente um produto | Autenticado (Apenas Admin) |
| `POST` | `/api/pedidos` | Cria um pedido processando itens e calculando frete | Autenticado (Cliente ou Admin) |
| `GET` | `/api/pedidos` | Retorna o histórico de pedidos do cliente logado | Autenticado |
| `GET` | `/api/pedidos?todos=true` | Retorna todos os pedidos cadastrados no sistema | Autenticado (Apenas Admin) |
| `PATCH` | `/api/pedidos/:id` | Altera o status do pedido no Kanban de produção | Autenticado (Apenas Admin) |

---

## 5. Coleções no MongoDB (Mongoose Schemas)

1. **`usuarios`**:
   * `nome`: String (Nome do usuário).
   * `email`: String (E-mail único).
   * `senha`: String (Senha criptografada com hash bcrypt).
   * `role`: String (Nível de acesso: `cliente` ou `admin`).
2. **`produtos`**:
   * `nome`: String (Nome do item).
   * `descricao`: String (Descrição dos ingredientes/preparo).
   * `preco`: Number (Valor unitário).
   * `categoria`: String (`cafe`, `bebida`, `acompanhamento`, `sobremesa`).
   * `imagemUrl`: String (URL da imagem).
   * `disponivel`: Boolean (Disponibilidade).
3. **`pedidos`**:
   * `cliente`: ObjectId (Referência ao model de Usuário).
   * `itens`: Array (Contém subdocumentos `produto`, `quantidade` e `precoUnitario` histórico).
   * `total`: Number (Valor total do pedido incluindo frete).
   * `status`: String (`pendente`, `preparando`, `pronto`, `entregue`, `cancelado`).
   * `tipoEntrega`: String (`entrega` ou `retirada`).
   * `endereco`: String (Endereço para entrega domiciliar).
   * `metodoPagamento`: String (`dinheiro`, `cartao` ou `pix`).
   * `observacoes`: String (Instruções opcionais do cliente).

---

## 6. Recursos Extras Desenvolvidos (Diferenciais)

* **Kanban Board Operacional**: Painel visual dinâmico estilo Trello com ações rápidas para baristas avançarem pedidos no fluxo de trabalho.
* **Dashboard de Inteligência de Negócio**: Aba analítica com cálculos automáticos de faturamento total, quantidade de pedidos, ticket médio e um gráfico de vendas por categoria gerado dinamicamente com animação em transição CSS.
* **Checkout em Múltiplas Etapas**: Processo interativo e fluido de finalização com tela de confirmação de dados para prevenir cliques por engano.
* **Segurança de Registro Admin**: Restrição total de registro de novas contas administrativas. Apenas um admin logado consegue criar outro admin na interface do painel.
