const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// CONEXÃO COM O BANCO DE DADOS
// ==========================================
const db = mysql.createConnection({
    host: '127.0.0.1',      // <- mudado de localhost para 127.0.0.1
    user: 'root',
    password: 'admin12',
    database: 'institutos_ambientais'
});

db.connect((err) => {
    if (err) {
        console.error('Falha crítica ao conectar no MySQL:', err);
        return;
    }
    console.log('Backend conectado com sucesso ao banco: institutos_ambientais');
});

// ==========================================
// ROTAS DA API
// ==========================================

// 1. GET: Consultar todas as unidades de conservação
app.get('/api/unidades', (req, res) => {
    const query = 'SELECT * FROM unidades_conservacao';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar unidades:', err);
            return res.status(500).json({ error: 'Erro interno no servidor de banco de dados.' });
        }
        res.status(200).json(results);
    });
});

// 2. POST: Inserir nova comunicação
app.post('/api/comunicacoes', (req, res) => {
    const { titulo, descricao, email_comunicante, unidade_id } = req.body;
    
    const query = `
        INSERT INTO comunicacoes (titulo, descricao, email_comunicante, unidade_id) 
        VALUES (?, ?, ?, ?)
    `;
    
    db.query(query, [titulo, descricao, email_comunicante, unidade_id], (err, results) => {
        if (err) {
            console.error('Erro ao gravar comunicação:', err);
            return res.status(500).json({ error: 'Falha ao registrar a comunicação no banco de dados.' });
        }
        res.status(201).json({ message: 'Comunicação gravada com sucesso.', insertId: results.insertId });
    });
});

// 3. GET: Comunicações de uma unidade, ordenadas da mais recente
app.get('/api/comunicacoes/:unidade_id', (req, res) => {
    const { unidade_id } = req.params;
    
    const query = `
        SELECT * FROM comunicacoes 
        WHERE unidade_id = ? 
        ORDER BY data_hora DESC
    `;
    
    db.query(query, [unidade_id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar comunicações da unidade:', err);
            return res.status(500).json({ error: 'Erro ao buscar o histórico de comunicações.' });
        }
        res.status(200).json(results);
    });
});

// ==========================================
// IGNIÇÃO DO SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {    // <- adicionado '0.0.0.0' para garantir que escuta em todos os endereços
    console.log(`Motor Backend operante. Escutando na porta ${PORT}...`);
});