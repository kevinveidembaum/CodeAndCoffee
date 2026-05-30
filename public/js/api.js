// ----------------------------------------------------
// API CLIENT - CODE&COFFEE
// Encapsula requisições fetch para o backend e gerencia o JWT
// ----------------------------------------------------

const API_BASE_URL = '/api';

const API = {
  // --- GERENCIAMENTO DE TOKEN NO LOCALSTORAGE ---
  salvarSessao(usuario, token) {
    localStorage.setItem('codecoffee_token', token);
    localStorage.setItem('codecoffee_usuario', JSON.stringify(usuario));
  },

  limparSessao() {
    localStorage.removeItem('codecoffee_token');
    localStorage.removeItem('codecoffee_usuario');
  },

  obterToken() {
    return localStorage.getItem('codecoffee_token');
  },

  obterUsuario() {
    const usuario = localStorage.getItem('codecoffee_usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  estaLogado() {
    return !!this.obterToken();
  },

  // --- REQUISIÇÃO AUXILIAR BASE ---
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Injetar headers padrão
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Injetar Token de Autenticação se disponível
    const token = this.obterToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar requisição');
      }

      return data;
    } catch (error) {
      console.error(`Erro na chamada API [${url}]:`, error.message);
      throw error;
    }
  },

  // --- ENDPOINTS DE AUTENTICAÇÃO ---
  async login(email, senha) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
    if (response.status === 'success' && response.data.token) {
      this.salvarSessao(
        {
          _id: response.data._id,
          nome: response.data.nome,
          email: response.data.email,
          role: response.data.role
        },
        response.data.token
      );
    }
    return response.data;
  },

  async registrar(nome, email, senha, role = 'cliente') {
    const response = await this.request('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha, role })
    });
    if (response.status === 'success' && response.data.token) {
      this.salvarSessao(
        {
          _id: response.data._id,
          nome: response.data.nome,
          email: response.data.email,
          role: response.data.role
        },
        response.data.token
      );
    }
    return response.data;
  },

  // --- ENDPOINTS DE PRODUTOS ---
  async listarProdutos(categoria = '') {
    const query = categoria && categoria !== 'todos' ? `?categoria=${categoria}` : '';
    return this.request(`/produtos${query}`);
  },

  async obterProduto(id) {
    return this.request(`/produtos/${id}`);
  },

  async criarProduto(produto) {
    return this.request('/produtos', {
      method: 'POST',
      body: JSON.stringify(produto)
    });
  },

  async atualizarProduto(id, produto) {
    return this.request(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(produto)
    });
  },

  async excluirProduto(id) {
    return this.request(`/produtos/${id}`, {
      method: 'DELETE'
    });
  },

  // --- ENDPOINTS DE PEDIDOS ---
  async criarPedido(itens, observacoes = '') {
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify({ itens, observacoes })
    });
  },

  async listarMeusPedidos() {
    return this.request('/pedidos');
  },

  async listarTodosPedidosAdmin() {
    return this.request('/pedidos?todos=true');
  },

  async atualizarStatusPedidoAdmin(id, status) {
    return this.request(`/pedidos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};
