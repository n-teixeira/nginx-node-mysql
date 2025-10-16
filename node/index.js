const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'nginx_node_mysql',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

function generateRandomBirthDate() {
  const startYear = 1950;
  const endYear = 2005;
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDateBR(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function waitForDatabase(retries = 30, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      pool = mysql.createPool(dbConfig);
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      console.log(`Aguardando MySQL... tentativa ${i + 1}/${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Não foi possível conectar ao MySQL');
}

app.get('/', async (req, res) => {
  try {
    const firstNames = ['Matheus', 'Ana', 'Carlos', 'Julia', 'Pedro', 'Maria', 'Lucas', 'Beatriz', 'Rafael', 'Fernanda', 'Gabriel', 'Amanda', 'Bruno', 'Camila', 'Diego'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida', 'Nascimento', 'Pereira', 'Carvalho', 'Ribeiro', 'Martins', 'Araujo'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const birthDate = generateRandomBirthDate();
    
    await pool.query('INSERT INTO people (name, birth_date) VALUES (?, ?)', [fullName, birthDate]);
    
    const [rows] = await pool.query('SELECT name, birth_date FROM people ORDER BY id DESC');
    
    let html = '<h1>Full Cycle Rocks!</h1>';
    html += '<h2>Lista de Pessoas Cadastradas:</h2>';
    html += '<ul style="font-family: Arial, sans-serif;">';
    rows.forEach(row => {
      html += `<li><strong>${row.name}</strong> - Nascimento: ${formatDateBR(row.birth_date)}</li>`;
    });
    html += '</ul>';
    html += `<p style="color: #666; margin-top: 20px;">Total de registros: ${rows.length}</p>`;
    
    res.send(html);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao processar requisição');
  }
});

app.get('/health', (req, res) => {
  res.send('OK');
});

(async () => {
  try {
    await waitForDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();