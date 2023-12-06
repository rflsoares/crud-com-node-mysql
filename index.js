const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const ejs = require('ejs');

dotenv.config();

const app = express();
const port = 3000;

// Configurar o Express para usar EJS como mecanismo de modelo
app.set('view engine', 'ejs');

// Conectar ao MySQL usando informações do .env
/*const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});*/
// Conectar ao MySQL usando informações do .env
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12senha",
  database: "itens"
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

// Middleware do Express para analisar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas para renderizar as views
// Rota para exibir a lista de itens
app.get('/itens', (req, res) => {
  connection.query('SELECT * FROM itens', (err, results) => {
    if (err) throw err;
    res.render('lista', { itens: results });
  });
});

// Rota para exibir o formulário de criação
app.get('/itens/novo', (req, res) => {
  res.render('formulario');
});

// Rota para exibir o formulário de edição
app.get('/itens/editar/:id', (req, res) => {
  const itemId = req.params.id;
  connection.query('SELECT * FROM itens WHERE id = ?', [itemId], (err, result) => {
    if (err) throw err;
    res.render('formulario', { item: result[0] });
  });
});

// Rota para lidar com a criação ou edição do item
app.post('/itens/:acao', (req, res) => {
  const acao = req.params.acao;
  const { nome, descricao } = req.body;
  if (acao === 'novo') {
    connection.query('INSERT INTO itens (nome, descricao) VALUES (?, ?)', [nome, descricao], (err) => {
      if (err) throw err;
      res.redirect('/itens');
    });
  } else if (acao === 'editar') {
    const itemId = req.body.itemId;
    connection.query('UPDATE itens SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, itemId], (err) => {
      if (err) throw err;
      res.redirect('/itens');
    });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});