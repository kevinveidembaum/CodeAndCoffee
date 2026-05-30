require('dotenv').config();
const mongoose = require('mongoose');
const Produto = require('./models/Produto');

const produtosIniciais = [
  // --- CAFÉS ---
  {
    nome: 'Espresso Tradicional',
    descricao: 'Café espresso curto clássico, encorpado e aromático com crema espessa. 50ml de puro café de grãos selecionados.',
    preco: 6.00,
    categoria: 'cafe',
    imagemUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Cappuccino Italiano',
    descricao: 'Bebida clássica italiana cremosa com doses iguais de café espresso, leite vaporizado e uma fina camada de chocolate belga.',
    preco: 12.00,
    categoria: 'cafe',
    imagemUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Café Latte',
    descricao: 'Café espresso suave combinado com leite vaporizado e uma cremosa camada de espuma de leite.',
    preco: 10.50,
    categoria: 'cafe',
    imagemUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Mocaccino',
    descricao: 'Combinação saborosa de calda de chocolate artesanal, café espresso ristretto e leite vaporizado bem cremoso.',
    preco: 11.00,
    categoria: 'cafe',
    imagemUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },

  // --- BEBIDAS GELADAS ---
  {
    nome: 'Cold Brew de Laranja',
    descricao: 'Café extraído a frio lentamente por 18 horas, servido gelado com um toque cítrico de suco de laranja natural.',
    preco: 11.00,
    categoria: 'bebida',
    imagemUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Soda Italiana de Frutas Vermelhas',
    descricao: 'Xarope artesanal de frutas vermelhas refrescante, água gaseificada na hora e pedras de gelo.',
    preco: 9.50,
    categoria: 'bebida',
    imagemUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Chá Gelado de Limão',
    descricao: 'Chá preto concentrado infusionado na casa, servido bem gelado com suco de limão siciliano e folhas frescas de hortelã.',
    preco: 8.50,
    categoria: 'bebida',
    imagemUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },

  // --- ACOMPANHAMENTOS ---
  {
    nome: 'Pão de Queijo Tradicional',
    descricao: 'Porção com 6 pequenos pães de queijo mineiros assados na hora, crocantes por fora e macios por dentro.',
    preco: 8.00,
    categoria: 'acompanhamento',
    imagemUrl: 'https://images.unsplash.com/photo-1629115911429-c89b25121b6d?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Toast de Abacate',
    descricao: 'Fatia generosa de pão de fermentação natural tostada na chapa com creme de abacate temperado, tomate cereja grelhado e sementes de gergelim.',
    preco: 14.50,
    categoria: 'acompanhamento',
    imagemUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Croissant Amanteigado',
    descricao: 'Croissant folhado clássico assado diariamente, leve, crocante e amanteigado, perfeito para qualquer hora do dia.',
    preco: 12.00,
    categoria: 'acompanhamento',
    imagemUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },

  // --- SOBREMESAS ---
  {
    nome: 'Brownie com Nozes',
    descricao: 'Brownie tradicional de chocolate meio amargo com recheio cremoso e pedaços crocantes de nozes.',
    preco: 10.00,
    categoria: 'sobremesa',
    imagemUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Cookie de Chocolate',
    descricao: 'Cookie americano gigante clássico com baunilha e gotas de chocolate ao leite e meio amargo.',
    preco: 7.50,
    categoria: 'sobremesa',
    imagemUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Cheesecake de Frutas Vermelhas',
    descricao: 'Cheesecake clássica de baunilha com base crocante de biscoito e calda artesanal de frutas vermelhas por cima.',
    preco: 15.00,
    categoria: 'sobremesa',
    imagemUrl: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Café Coado Especial',
    descricao: 'Café coado individualmente na mesa com grãos de torra média selecionados. Aroma suave e notas frutadas. 150ml.',
    preco: 8.00,
    categoria: 'cafe',
    imagemUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Affogato',
    descricao: 'Uma bola de sorvete artesanal de creme submersa em um shot quente de espresso tradicional encorpado.',
    preco: 13.00,
    categoria: 'cafe',
    imagemUrl: 'https://images.unsplash.com/photo-1594911774802-8822a7079af1?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Frappé de Caramelo',
    descricao: 'Bebida gelada batida com café espresso, leite, gelo e calda artesanal de caramelo, finalizada com chantilly.',
    preco: 14.00,
    categoria: 'bebida',
    imagemUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Suco Natural de Laranja',
    descricao: 'Suco de laranja espremido na hora, natural e refrescante. Sem adição de açúcar ou água. 300ml.',
    preco: 8.00,
    categoria: 'bebida',
    imagemUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Quiche de Alho Poró',
    descricao: 'Quiche individual com massa podre crocante e recheio cremoso de alho-poró com queijo minas padrão.',
    preco: 11.50,
    categoria: 'acompanhamento',
    imagemUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Misto Quente Especial',
    descricao: 'Clássico misto quente feito na baguete artesanal com queijo prato derretido e presunto cozido de alta qualidade na chapa.',
    preco: 10.00,
    categoria: 'acompanhamento',
    imagemUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  },
  {
    nome: 'Torta de Limão',
    descricao: 'Torta individual de limão com base de biscoito amanteigado, recheio cremoso e azedinho de limão e cobertura de merengue tostado.',
    preco: 12.50,
    categoria: 'sobremesa',
    imagemUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60',
    disponivel: true
  }
];

const semearBanco = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codeAndCoffee';
  
  try {
    console.log('Iniciando conexão com MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Conexão ativa! Limpando coleção de produtos antiga...');
    
    await Produto.deleteMany({});
    console.log('Coleção limpa! Inserindo novos produtos temáticos...');
    
    const produtosCriados = await Produto.insertMany(produtosIniciais);
    console.log(`Sucesso! ${produtosCriados.length} produtos foram cadastrados com sucesso no banco.`);
    
    mongoose.connection.close();
    console.log('Conexão encerrada com o MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao semear o banco de dados:', error.message);
    process.exit(1);
  }
};

semearBanco();
