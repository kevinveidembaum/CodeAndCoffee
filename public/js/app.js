// ----------------------------------------------------
// CORE APP LOGIC - CODE&COFFEE
// Manipulação do DOM, Carrinho, Navegação e Admin
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // --- ESTADO GLOBAL DA APLICAÇÃO ---
  let carrinho = obterCarrinhoSalvo();
  let produtosCache = [];
  let usuarioLogado = API.obterUsuario();

  // --- SELETORES DO DOM ---
  // Loaders e Toasts
  const loader = document.getElementById('global-loader');
  const toastContainer = document.getElementById('toast-container');

  // Navegação
  const navBtnMenu = document.getElementById('nav-btn-menu');
  const navBtnPedidos = document.getElementById('nav-btn-pedidos');
  const navBtnAdmin = document.getElementById('nav-btn-admin');
  const sections = {
    menu: document.getElementById('menu-section'),
    pedidos: document.getElementById('orders-section'),
    admin: document.getElementById('admin-section')
  };

  // Autenticação
  const authBtn = document.getElementById('auth-btn');
  const authModal = document.getElementById('auth-modal');
  const authOverlay = document.getElementById('auth-overlay');
  const closeAuthBtn = document.getElementById('close-auth-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');

  // Cardápio
  const menuGrid = document.getElementById('menu-grid');
  const categoriesFilter = document.getElementById('categories-filter');

  // Carrinho
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCountBadge = document.getElementById('cart-count');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalValue = document.getElementById('cart-total-value');
  const orderNotes = document.getElementById('order-notes');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Pedidos Cliente
  const ordersList = document.getElementById('orders-list');

  // Painel Admin - Geral e Abas
  const adminAddProductBtn = document.getElementById('admin-add-product-btn');
  const adminProductsList = document.getElementById('admin-products-list');
  const adminOrdersList = document.getElementById('admin-orders-list');
  const adminTabs = document.querySelectorAll('.admin-tabs .tab-btn');
  const adminTabContents = document.querySelectorAll('#admin-section .tab-content');

  // Painel Admin - Modal de Produto
  const productModal = document.getElementById('product-modal');
  const productForm = document.getElementById('product-form');
  const productModalTitle = document.getElementById('product-modal-title');
  const closeProductModalBtn = document.getElementById('close-product-modal-btn');
  const productOverlay = document.getElementById('product-overlay');

  // Painel Admin - Modal de Criação de Admin
  const adminCreateAdminBtn = document.getElementById('admin-create-admin-btn');
  const adminUserModal = document.getElementById('admin-user-modal');
  const adminUserForm = document.getElementById('admin-user-form');
  const closeAdminUserBtn = document.getElementById('close-admin-user-btn');
  const adminUserOverlay = document.getElementById('admin-user-overlay');

  // --- INICIALIZAÇÃO ---
  mostrarLoader(false);
  atualizarInterfaceUsuario();
  carregarProdutos();
  renderizarCarrinho();

  // --- FUNÇÕES DE FEEDBACK VISUAL ---
  function mostrarLoader(show) {
    if (show) {
      loader.classList.remove('hidden');
    } else {
      loader.classList.add('hidden');
    }
  }

  function mostrarToast(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    let icone = 'fa-info-circle';
    if (tipo === 'success') icone = 'fa-check-circle';
    if (tipo === 'error') icone = 'fa-exclamation-circle';

    toast.innerHTML = `
      <i class="fa-solid ${icone}"></i>
      <span>${mensagem}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remover após 3.5 segundos
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // --- NAVEGAÇÃO ENTRE TELAS ---
  function alternarTela(telaAtiva) {
    Object.keys(sections).forEach(key => {
      if (key === telaAtiva) {
        sections[key].classList.remove('hidden');
      } else {
        sections[key].classList.add('hidden');
      }
    });

    // Atualizar classe active nos botões da navbar
    navBtnMenu.classList.toggle('active', telaAtiva === 'menu');
    navBtnPedidos.classList.toggle('active', telaAtiva === 'pedidos');
    navBtnAdmin.classList.toggle('active', telaAtiva === 'admin');

    if (telaAtiva === 'pedidos') {
      carregarPedidosCliente();
    } else if (telaAtiva === 'admin') {
      carregarDadosAdmin();
    }
  }

  navBtnMenu.addEventListener('click', (e) => {
    e.preventDefault();
    alternarTela('menu');
  });

  navBtnPedidos.addEventListener('click', (e) => {
    e.preventDefault();
    alternarTela('pedidos');
  });

  navBtnAdmin.addEventListener('click', (e) => {
    e.preventDefault();
    alternarTela('admin');
  });

  // Abas de administração
  adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      adminTabs.forEach(t => t.classList.remove('active'));
      adminTabContents.forEach(c => c.classList.add('hidden'));

      tab.classList.add('active');
      const targetTab = document.getElementById(tab.dataset.tab);
      if (targetTab) targetTab.classList.remove('hidden');

      // Se a aba selecionada for a de métricas, carregar dados
      if (tab.dataset.tab === 'admin-metrics-tab') {
        carregarMetricasAdmin();
      }
    });
  });

  function atualizarInterfaceUsuario() {
    usuarioLogado = API.obterUsuario();
    
    // Sincronizar carrinho específico do usuário logado (ou visitante)
    carrinho = obterCarrinhoSalvo();
    renderizarCarrinho();
    
    if (usuarioLogado) {
      // Alterar botão de Entrar para Sair
      authBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> <span>Sair (${usuarioLogado.nome.split(' ')[0]})</span>`;
      
      // Mostrar ou esconder menu de Admin
      if (usuarioLogado.role === 'admin') {
        navBtnAdmin.classList.remove('hidden');
      } else {
        navBtnAdmin.classList.add('hidden');
        if (!sections.admin.classList.contains('hidden')) {
          alternarTela('menu'); // Redireciona se estiver na tela de admin sem ser admin
        }
      }
    } else {
      authBtn.innerHTML = `<i class="fa-solid fa-user-astronaut"></i> <span>Entrar</span>`;
      navBtnAdmin.classList.add('hidden');
      if (!sections.admin.classList.contains('hidden') || !sections.pedidos.classList.contains('hidden')) {
        alternarTela('menu'); // Redireciona caso saia da conta nas telas protegidas
      }
    }
  }

  // Ação do botão de Autenticação (Entrar / Sair)
  authBtn.addEventListener('click', () => {
    if (API.estaLogado()) {
      API.limparSessao();
      atualizarInterfaceUsuario();
      mostrarToast('Você saiu da sua conta', 'info');
    } else {
      abrirModalAuth(true);
    }
  });

  // --- GERENCIAMENTO DE MODAL DE AUTENTICAÇÃO ---
  function abrirModalAuth(showLogin = true) {
    authModal.classList.add('active');
    alternarAbasAuth(showLogin);
  }

  function fecharModalAuth() {
    authModal.classList.remove('active');
    loginForm.reset();
    registerForm.reset();
  }

  function alternarAbasAuth(showLogin) {
    if (showLogin) {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      tabLoginBtn.classList.remove('active');
      tabRegisterBtn.classList.add('active');
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    }
  }

  tabLoginBtn.addEventListener('click', () => alternarAbasAuth(true));
  tabRegisterBtn.addEventListener('click', () => alternarAbasAuth(false));
  closeAuthBtn.addEventListener('click', fecharModalAuth);
  authOverlay.addEventListener('click', fecharModalAuth);

  // Envio do Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    mostrarLoader(true);
    try {
      await API.login(email, senha);
      fecharModalAuth();
      atualizarInterfaceUsuario();
      mostrarToast('Bem-vindo ao terminal Code&Coffee!', 'success');
    } catch (error) {
      mostrarToast(error.message, 'error');
    } finally {
      mostrarLoader(false);
    }
  });

  // Envio do Registro
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const senha = document.getElementById('register-senha').value;

    mostrarLoader(true);
    try {
      await API.registrar(nome, email, senha);
      fecharModalAuth();
      atualizarInterfaceUsuario();
      mostrarToast('Sua conta foi compilada com sucesso!', 'success');
    } catch (error) {
      mostrarToast(error.message, 'error');
    } finally {
      mostrarLoader(false);
    }
  });


  // --- CARREGAMENTO DO CARDÁPIO ---
  async function carregarProdutos(categoria = '') {
    mostrarLoader(true);
    try {
      const response = await API.listarProdutos(categoria);
      produtosCache = response.data;
      renderizarCardapio(produtosCache);
    } catch (error) {
      mostrarToast('Falha ao baixar cardápio. Verifique o servidor.', 'error');
      menuGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Erro ao conectar com o banco de dados. Tente recarregar.</p>
        </div>
      `;
    } finally {
      mostrarLoader(false);
    }
  }

  function renderizarCardapio(produtos) {
    if (produtos.length === 0) {
      menuGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-mug-hot"></i>
          <p>Nenhum produto cadastrado nesta categoria.</p>
        </div>
      `;
      return;
    }

    menuGrid.innerHTML = produtos.map(prod => {
      const categoryNames = {
        cafe: 'Café',
        bebida: 'Bebida Gelada',
        acompanhamento: 'Acompanhamento',
        sobremesa: 'Sobremesa'
      };

      const acaoBtn = prod.disponivel 
        ? `<button class="btn btn-primary add-to-cart-btn" data-id="${prod._id}">
            <i class="fa-solid fa-plus"></i> Adicionar
           </button>`
        : `<span class="out-of-stock-badge"><i class="fa-solid fa-circle-ban"></i> Indisponível</span>`;

      return `
        <div class="product-card">
          <div class="product-image-container">
            <img class="product-img" src="${prod.imagemUrl}" alt="${prod.nome}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'">
            <span class="product-tag">${categoryNames[prod.categoria] || prod.categoria}</span>
          </div>
          <div class="product-info">
            <h3>${prod.nome}</h3>
            <p class="product-desc">${prod.descricao}</p>
            <div class="product-footer">
              <span class="product-price">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
              ${acaoBtn}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Listener para botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prodId = btn.dataset.id;
        adicionarAoCarrinho(prodId);
      });
    });
  }

  // Filtros de Categoria
  categoriesFilter.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      const categoria = e.target.dataset.category;
      carregarProdutos(categoria);
    }
  });


  // --- MECÂNICA DO CARRINHO ---
  function obterChaveCarrinho() {
    const usuario = API.obterUsuario();
    return usuario ? `codecoffee_carrinho_${usuario._id}` : 'codecoffee_carrinho_visitante';
  }

  function obterCarrinhoSalvo() {
    const chave = obterChaveCarrinho();
    const localData = localStorage.getItem(chave);
    return localData ? JSON.parse(localData) : [];
  }

  function salvarCarrinho() {
    const chave = obterChaveCarrinho();
    localStorage.setItem(chave, JSON.stringify(carrinho));
  }

  function abrirCarrinho() {
    cartDrawer.classList.add('active');
  }

  function fecharCarrinho() {
    cartDrawer.classList.remove('active');
  }

  cartToggleBtn.addEventListener('click', abrirCarrinho);
  closeCartBtn.addEventListener('click', fecharCarrinho);
  cartOverlay.addEventListener('click', fecharCarrinho);

  function adicionarAoCarrinho(produtoId) {
    const produto = produtosCache.find(p => p._id === produtoId);
    if (!produto) return;

    const itemExistente = carrinho.find(item => item.produtoId === produtoId);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({
        produtoId: produto._id,
        nome: produto.nome,
        preco: produto.preco,
        imagemUrl: produto.imagemUrl,
        quantidade: 1
      });
    }

    salvarCarrinho();
    renderizarCarrinho();
    mostrarToast(`"${produto.nome}" adicionado ao carrinho!`, 'success');
  }

  function atualizarQuantidade(produtoId, delta) {
    const item = carrinho.find(item => item.produtoId === produtoId);
    if (!item) return;

    item.quantidade += delta;

    if (item.quantidade <= 0) {
      carrinho = carrinho.filter(i => i.produtoId !== produtoId);
    }

    salvarCarrinho();
    renderizarCarrinho();
  }

  function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(i => i.produtoId !== produtoId);
    salvarCarrinho();
    renderizarCarrinho();
  }

  function renderizarCarrinho() {
    // Atualizar badge de quantidade total
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    cartCountBadge.textContent = totalItens;

    if (carrinho.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-basket-shopping"></i>
          <p>Seu carrinho está vazio.</p>
        </div>
      `;
      cartTotalValue.textContent = 'R$ 0,00';
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;
    cartItemsContainer.innerHTML = carrinho.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.imagemUrl}" alt="${item.nome}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.nome}</div>
          <div class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn q-minus" data-id="${item.produtoId}"><i class="fa-solid fa-minus"></i></button>
            <span class="quantity-val">${item.quantidade}</span>
            <button class="quantity-btn q-plus" data-id="${item.produtoId}"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${item.produtoId}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    // Adicionar escuta nos botões do carrinho
    document.querySelectorAll('.q-minus').forEach(btn => {
      btn.addEventListener('click', () => atualizarQuantidade(btn.dataset.id, -1));
    });
    document.querySelectorAll('.q-plus').forEach(btn => {
      btn.addEventListener('click', () => atualizarQuantidade(btn.dataset.id, 1));
    });
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => removerDoCarrinho(btn.dataset.id));
    });

    // Atualizar valor total
    const valorTotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    cartTotalValue.textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
  }

  // Checkout (Enviar Pedido)
  checkoutBtn.addEventListener('click', async () => {
    if (!API.estaLogado()) {
      fecharCarrinho();
      abrirModalAuth(true);
      mostrarToast('Por favor, faça login antes de fechar o pedido.', 'info');
      return;
    }

    mostrarLoader(true);
    const itensFormatoApi = carrinho.map(item => ({
      produto: item.produtoId,
      quantidade: item.quantidade
    }));

    try {
      const resp = await API.criarPedido(itensFormatoApi, orderNotes.value);
      carrinho = [];
      salvarCarrinho();
      renderizarCarrinho();
      orderNotes.value = '';
      fecharCarrinho();
      mostrarToast('Pedido compilado com sucesso!', 'success');
      alternarTela('pedidos');
    } catch (error) {
      mostrarToast(error.message, 'error');
    } finally {
      mostrarLoader(false);
    }
  });


  // --- PEDIDOS DO CLIENTE ---
  async function carregarPedidosCliente() {
    if (!API.estaLogado()) {
      ordersList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-user-astronaut"></i>
          <p>Você precisa estar logado para ver seus pedidos.</p>
          <button class="btn btn-primary" id="orders-login-btn">Fazer Login</button>
        </div>
      `;
      document.getElementById('orders-login-btn').addEventListener('click', () => abrirModalAuth(true));
      return;
    }

    mostrarLoader(true);
    try {
      const response = await API.listarMeusPedidos();
      const pedidos = response.data;
      renderizarPedidosCliente(pedidos);
    } catch (error) {
      mostrarToast(error.message, 'error');
    } finally {
      mostrarLoader(false);
    }
  }

  function renderizarPedidosCliente(pedidos) {
    if (pedidos.length === 0) {
      ordersList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <p>Nenhum pedido efetuado ainda. Vá ao menu e monte seu carrinho!</p>
        </div>
      `;
      return;
    }

    const statusBadgeClasses = {
      pendente: 'badge-danger',
      preparando: 'badge-success', // laranja/amarelo ou verde
      pronto: 'badge-success',
      entregue: 'badge-success',
      cancelado: 'badge-danger'
    };

    const statusTraduzido = {
      pendente: 'Pendente',
      preparando: 'Na Cozinha',
      pronto: 'Pronto para Retirada',
      entregue: 'Entregue',
      cancelado: 'Cancelado'
    };

    ordersList.innerHTML = pedidos.map(ped => {
      const dataFormatada = new Date(ped.createdAt).toLocaleString('pt-BR');
      
      const itensHtml = ped.itens.map(it => `
        <div class="order-item-desc">
          <span>${it.quantidade}x ${it.produto ? it.produto.nome : 'Produto Removido'}</span>
          <span>R$ ${(it.precoUnitario * it.quantidade).toFixed(2).replace('.', ',')}</span>
        </div>
      `).join('');

      return `
        <div class="order-card">
          <div class="order-header">
            <div>
              <span class="order-id">#ID-${ped._id.slice(-6).toUpperCase()}</span>
              <div class="order-date">${dataFormatada}</div>
            </div>
            <span class="badge ${statusBadgeClasses[ped.status]}">${statusTraduzido[ped.status]}</span>
          </div>
          <div class="order-items-list">
            ${itensHtml}
          </div>
          ${ped.observacoes ? `<p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;"><strong>Obs:</strong> ${ped.observacoes}</p>` : ''}
          <div class="order-total-section">
            <span>Total pago</span>
            <span>R$ ${ped.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      `;
    }).join('');
  }


  // --- PAINEL ADMINISTRATIVO ---
  function carregarDadosAdmin() {
    carregarProdutosTabelaAdmin();
    carregarPedidosGerenciamentoAdmin();
  }

  // Admin - Aba Produtos
  async function carregarProdutosTabelaAdmin() {
    try {
      const response = await API.listarProdutos();
      const produtos = response.data;
      
      adminProductsList.innerHTML = produtos.map(prod => `
        <tr>
          <td><img class="admin-table-img" src="${prod.imagemUrl}" alt="${prod.nome}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'"></td>
          <td><strong>${prod.nome}</strong><br><span style="font-size:0.8rem; color:var(--text-muted);">${prod.descricao.substring(0, 45)}...</span></td>
          <td>${prod.categoria}</td>
          <td>R$ ${prod.preco.toFixed(2).replace('.', ',')}</td>
          <td>
            <span class="badge ${prod.disponivel ? 'badge-success' : 'badge-danger'}">
              ${prod.disponivel ? 'Disponível' : 'Indisponível'}
            </span>
          </td>
          <td>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-secondary edit-product-btn" data-id="${prod._id}" style="padding:6px 12px; font-size:0.8rem;"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-danger delete-product-btn" data-id="${prod._id}" style="padding:6px 12px; font-size:0.8rem;"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `).join('');

      // Ouvintes de evento na tabela
      document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', () => abrirFormularioProduto(btn.dataset.id));
      });
      document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', () => deletarProduto(btn.dataset.id));
      });

    } catch (error) {
      mostrarToast('Erro ao carregar produtos na tabela administrativa', 'error');
    }
  }

  // Admin - Aba Pedidos Clientes (Kanban)
  async function carregarPedidosGerenciamentoAdmin() {
    try {
      const response = await API.listarTodosPedidosAdmin();
      const pedidos = response.data;

      // Selecionar os contêineres e contadores das colunas
      const lists = {
        pendente: document.getElementById('list-pendente'),
        preparando: document.getElementById('list-preparando'),
        pronto: document.getElementById('list-pronto'),
        finalizado: document.getElementById('list-finalizado')
      };

      const counts = {
        pendente: document.getElementById('count-pendente'),
        preparando: document.getElementById('count-preparando'),
        pronto: document.getElementById('count-pronto'),
        finalizado: document.getElementById('count-finalizado')
      };

      // Limpar todos os contêineres primeiro
      Object.keys(lists).forEach(status => {
        if (lists[status]) lists[status].innerHTML = '';
      });

      // Separar os pedidos por status
      const grupos = {
        pendente: pedidos.filter(p => p.status === 'pendente'),
        preparando: pedidos.filter(p => p.status === 'preparando'),
        pronto: pedidos.filter(p => p.status === 'pronto'),
        finalizado: pedidos.filter(p => p.status === 'entregue' || p.status === 'cancelado')
      };

      // Atualizar contadores
      Object.keys(counts).forEach(status => {
        if (counts[status]) counts[status].textContent = grupos[status].length;
      });

      // Renderizar cada coluna
      Object.keys(lists).forEach(status => {
        const container = lists[status];
        if (!container) return;

        const pedidosDoGrupo = grupos[status];

        if (pedidosDoGrupo.length === 0) {
          container.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding:20px;">Nenhum pedido</div>`;
          return;
        }

        container.innerHTML = pedidosDoGrupo.map(ped => {
          const dataFormatada = new Date(ped.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const clienteNome = ped.cliente ? ped.cliente.nome : 'Cliente Visitante';

          const itensHtml = ped.itens.map(it => `
            <div class="kanban-card-item">
              <span>${it.quantidade}x ${it.produto ? it.produto.nome : 'Produto Removido'}</span>
            </div>
          `).join('');

          // Gerar botões de ação dinâmicos baseados no status atual
          let botoesAcao = '';
          if (ped.status === 'pendente') {
            botoesAcao = `
              <button class="btn btn-primary action-kanban-btn" data-id="${ped._id}" data-status="preparando">Iniciar Preparo</button>
              <button class="btn btn-danger action-kanban-btn" data-id="${ped._id}" data-status="cancelado" title="Cancelar Pedido"><i class="fa-solid fa-ban"></i></button>
            `;
          } else if (ped.status === 'preparando') {
            botoesAcao = `
              <button class="btn btn-success action-kanban-btn" data-id="${ped._id}" data-status="pronto">Pronto</button>
            `;
          } else if (ped.status === 'pronto') {
            botoesAcao = `
              <button class="btn btn-primary action-kanban-btn" data-id="${ped._id}" data-status="entregue">Entregar</button>
            `;
          } else {
            // Finalizado (entregue / cancelado)
            const isCancelado = ped.status === 'cancelado';
            botoesAcao = `<span class="badge ${isCancelado ? 'badge-danger' : 'badge-success'}" style="text-align:center; width:100%; display:block;">${isCancelado ? 'Cancelado' : 'Entregue'}</span>`;
          }

          return `
            <div class="kanban-card">
              <div class="kanban-card-header">
                <span class="kanban-card-id">#${ped._id.slice(-6).toUpperCase()}</span>
                <span class="kanban-card-time"><i class="fa-regular fa-clock"></i> ${dataFormatada}</span>
              </div>
              <div class="kanban-card-client"><i class="fa-solid fa-user"></i> ${clienteNome}</div>
              <div class="kanban-card-items">
                ${itensHtml}
              </div>
              ${ped.observacoes ? `<div class="kanban-card-notes"><strong>Obs:</strong> ${ped.observacoes}</div>` : ''}
              <div class="kanban-card-total">
                <span>Total</span>
                <span>R$ ${ped.total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div class="kanban-card-actions">
                ${botoesAcao}
              </div>
            </div>
          `;
        }).join('');
      });

      // Adicionar escuta de eventos aos botões de ação do Kanban
      document.querySelectorAll('.action-kanban-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const pedId = btn.dataset.id;
          const novoStatus = btn.dataset.status;

          mostrarLoader(true);
          try {
            await API.atualizarStatusPedidoAdmin(pedId, novoStatus);
            mostrarToast('Pedido atualizado com sucesso!', 'success');
            carregarPedidosGerenciamentoAdmin();
          } catch (error) {
            mostrarToast(error.message, 'error');
          } finally {
            mostrarLoader(false);
          }
        });
      });

    } catch (error) {
      console.error('Erro ao renderizar Kanban de pedidos:', error);
      mostrarToast('Erro ao carregar gerenciamento de pedidos', 'error');
    }
  }

  // Admin - Aba Métricas (Relatórios)
  async function carregarMetricasAdmin() {
    mostrarLoader(true);
    try {
      const response = await API.listarTodosPedidosAdmin();
      const pedidos = response.data;

      // 1. Faturamento Total (Apenas pedidos entregues)
      const pedidosEntregues = pedidos.filter(p => p.status === 'entregue');
      const faturamentoTotal = pedidosEntregues.reduce((acc, p) => acc + p.total, 0);

      // 2. Total de Pedidos (todos os pedidos)
      const totalPedidos = pedidos.length;

      // 3. Ticket Médio (Faturamento / Pedidos Entregues)
      const ticketMedio = faturamentoTotal / (pedidosEntregues.length || 1);

      // Injetar valores nos cards
      document.getElementById('metric-revenue').textContent = `R$ ${faturamentoTotal.toFixed(2).replace('.', ',')}`;
      document.getElementById('metric-orders-count').textContent = totalPedidos;
      document.getElementById('metric-ticket-average').textContent = `R$ ${ticketMedio.toFixed(2).replace('.', ',')}`;

      // 4. Pedidos por Status
      const contagemStatus = {
        pendente: pedidos.filter(p => p.status === 'pendente').length,
        preparando: pedidos.filter(p => p.status === 'preparando').length,
        pronto: pedidos.filter(p => p.status === 'pronto').length,
        entregue: pedidos.filter(p => p.status === 'entregue').length,
        cancelado: pedidos.filter(p => p.status === 'cancelado').length
      };

      const statusNomes = {
        pendente: 'Pendentes',
        preparando: 'Em Preparo',
        pronto: 'Prontos',
        entregue: 'Entregues',
        cancelado: 'Cancelados'
      };

      const statusSummaryList = document.getElementById('status-summary-list');
      statusSummaryList.innerHTML = Object.keys(contagemStatus).map(status => `
        <div class="status-summary-item">
          <div class="status-summary-label">
            <span class="status-indicator ${status}"></span>
            <span>${statusNomes[status]}</span>
          </div>
          <span class="status-summary-val">${contagemStatus[status]}</span>
        </div>
      `).join('');

      // 5. Vendas por Categoria (Quantidade de itens comprados)
      const categoriaVendas = {
        cafe: 0,
        bebida: 0,
        acompanhamento: 0,
        sobremesa: 0
      };

      // Computar quantidades de produtos vendidos em pedidos não cancelados
      pedidos.filter(p => p.status !== 'cancelado').forEach(ped => {
        ped.itens.forEach(it => {
          if (it.produto && it.produto.categoria) {
            const cat = it.produto.categoria;
            if (categoriaVendas[cat] !== undefined) {
              categoriaVendas[cat] += it.quantidade;
            }
          }
        });
      });

      const categoriaNomes = {
        cafe: 'Cafés',
        bebida: 'Bebidas Geladas',
        acompanhamento: 'Acompanhamentos',
        sobremesa: 'Sobremesas'
      };

      // Achar o valor máximo para escala do gráfico (porcentagem de largura da barra)
      const maxVendas = Math.max(...Object.values(categoriaVendas), 1);

      const categorySalesChart = document.getElementById('category-sales-chart');
      categorySalesChart.innerHTML = Object.keys(categoriaVendas).map(cat => {
        const quantidade = categoriaVendas[cat];

        return `
          <div class="chart-bar-container">
            <div class="chart-bar-label">
              <span>${categoriaNomes[cat]}</span>
              <strong>${quantidade} unid.</strong>
            </div>
            <div class="chart-bar-track">
              <div class="chart-bar-fill" style="width: 0%;"></div>
            </div>
          </div>
        `;
      }).join('');

      // Animar o preenchimento das barras após um pequeno delay para efeito visual
      setTimeout(() => {
        const fills = categorySalesChart.querySelectorAll('.chart-bar-fill');
        Object.keys(categoriaVendas).forEach((cat, index) => {
          const quantidade = categoriaVendas[cat];
          const porcentagem = (quantidade / maxVendas) * 100;
          if (fills[index]) {
            fills[index].style.width = `${porcentagem}%`;
          }
        });
      }, 100);

    } catch (error) {
      console.error('Erro ao processar métricas:', error);
      mostrarToast('Erro ao carregar relatórios e métricas', 'error');
    } finally {
      mostrarLoader(false);
    }
  }

  adminAddProductBtn.addEventListener('click', () => abrirFormularioProduto());

  async function abrirFormularioProduto(produtoId = null) {
    productForm.reset();
    document.getElementById('product-id').value = '';
    
    if (produtoId) {
      productModalTitle.textContent = 'Editar Produto';
      mostrarLoader(true);
      try {
        const response = await API.obterProduto(produtoId);
        const prod = response.data;
        
        document.getElementById('product-id').value = prod._id;
        document.getElementById('product-name').value = prod.nome;
        document.getElementById('product-category').value = prod.categoria;
        document.getElementById('product-price').value = prod.preco;
        document.getElementById('product-desc').value = prod.descricao;
        document.getElementById('product-image').value = prod.imagemUrl;
        document.getElementById('product-available').checked = prod.disponivel;
      } catch (error) {
        mostrarToast('Erro ao obter detalhes do produto', 'error');
        fecharFormularioProduto();
      } finally {
        mostrarLoader(false);
      }
    } else {
      productModalTitle.textContent = 'Novo Produto';
    }
    
    productModal.classList.add('active');
  }

  function fecharFormularioProduto() {
    productModal.classList.remove('active');
    productForm.reset();
  }

  closeProductModalBtn.addEventListener('click', fecharFormularioProduto);
  productOverlay.addEventListener('click', fecharFormularioProduto);

  // Envio de formulário de produto (criar/editar)
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const produtoPayload = {
      nome: document.getElementById('product-name').value,
      categoria: document.getElementById('product-category').value,
      preco: parseFloat(document.getElementById('product-price').value),
      descricao: document.getElementById('product-desc').value,
      imagemUrl: document.getElementById('product-image').value,
      disponivel: document.getElementById('product-available').checked
    };

    mostrarLoader(true);
    try {
      if (id) {
        await API.atualizarProduto(id, produtoPayload);
        mostrarToast('Produto atualizado com sucesso!', 'success');
      } else {
        await API.criarProduto(produtoPayload);
        mostrarToast('Produto inserido com sucesso!', 'success');
      }
      fecharFormularioProduto();
      carregarProdutos();
      carregarProdutosTabelaAdmin();
    } catch (error) {
      mostrarToast(error.message, 'error');
    } finally {
      mostrarLoader(false);
    }
  });

  // Deletar Produto
  async function deletarProduto(id) {
    if (confirm('Tem certeza de que deseja deletar permanentemente este produto do menu?')) {
      mostrarLoader(true);
      try {
        await API.excluirProduto(id);
        mostrarToast('Produto removido do cardápio!', 'success');
        carregarProdutos();
        carregarProdutosTabelaAdmin();
      } catch (error) {
        mostrarToast(error.message, 'error');
      } finally {
        mostrarLoader(false);
      }
    }
  }

  // --- CADASTRO DE NOVO ADMINISTRADOR ---
  function abrirModalAdminUser() {
    adminUserForm.reset();
    adminUserModal.classList.add('active');
  }

  function fecharModalAdminUser() {
    adminUserModal.classList.remove('active');
    adminUserForm.reset();
  }

  if (adminCreateAdminBtn) {
    adminCreateAdminBtn.addEventListener('click', abrirModalAdminUser);
  }
  if (closeAdminUserBtn) {
    closeAdminUserBtn.addEventListener('click', fecharModalAdminUser);
  }
  if (adminUserOverlay) {
    adminUserOverlay.addEventListener('click', fecharModalAdminUser);
  }

  if (adminUserForm) {
    adminUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('admin-user-name').value;
      const email = document.getElementById('admin-user-email').value;
      const senha = document.getElementById('admin-user-senha').value;

      mostrarLoader(true);
      try {
        await API.registrarAdmin(nome, email, senha);
        mostrarToast('Novo administrador cadastrado com sucesso!', 'success');
        fecharModalAdminUser();
      } catch (error) {
        mostrarToast(error.message, 'error');
      } finally {
        mostrarLoader(false);
      }
    });
  }

});
