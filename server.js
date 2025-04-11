import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database connection pool
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'senac@02',
    database: 'salinet',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Unified API endpoint for all operations
app.post('/api/mysql', async (req, res) => {
    const { nome, login, senha, tipo } = req.body;
    
    try {
        switch (tipo) {
            case 'cadastro':
                await handleCadastro(res, nome, login, senha);
                break;
            case 'login':
                await handleLogin(res, nome, login, senha);
                break;
            case 'leitura':
                await handleLeitura(res, nome, login);
                break;
            case 'remocao':
                await handleRemocao(res, nome, login, senha);
                break;
            default:
                throw new Error("Tipo de operação não reconhecido!");
        }
    } catch (err) {
        console.error('Erro na operação:', err.message);
        res.status(500).json({ 
            success: false,
            message: err.message || 'Erro interno no servidor'
        });
    }
});

// Operation handlers
async function handleCadastro(res, nome, login, senha) {
    const [rows] = await pool.query(
        "INSERT INTO `salinet`.`tbl_login` (`nome`, `login`, `senha`) VALUES (?, ?, ?)",
        [nome, login, senha]
    );
    
    if (rows.affectedRows > 0) {
        res.json({ 
            success: true,
            message: 'Usuário cadastrado com sucesso!' 
        });
    } else {
        throw new Error('Não foi possível cadastrar o usuário!');
    }
}

async function handleLogin(res, nome, login, senha) {
    const [rows] = await pool.query(
        "SELECT * FROM `salinet`.`tbl_login` WHERE `nome` = ? AND `login` = ? AND `senha` = ?",
        [nome, login, senha]
    );
    
    if (rows.length === 1) {
        res.json({ 
            success: true,
            message: 'Usuário logado com sucesso',
            userData: rows[0]
        });
    } else {
        throw new Error('Credenciais inválidas!');
    }
}

async function handleLeitura(res, nome, login) {
    const conditions = [];
    const params = [];
    
    if (nome?.trim()) {
        conditions.push("`nome` LIKE ?");
        params.push(`%${nome.trim()}%`);
    }
    
    if (login?.trim()) {
        conditions.push("`login` LIKE ?");
        params.push(`%${login.trim()}%`);
    }
    
    const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(' AND ')}` 
        : '';
    
    const [rows] = await pool.query(
        `SELECT * FROM \`salinet\`.\`tbl_login\` ${whereClause}`,
        params
    );
    
    if (rows.length > 0) {
        res.json({ 
            success: true,
            message: 'Dados encontrados com sucesso!',
            data: rows,
            total: rows.length
        });
    } else {
        throw new Error('Nenhum registro encontrado!');
    }
}

async function handleRemocao(res, nome, login, senha) {
    // First verify the user exists
    const [verifyRows] = await pool.query(
        "SELECT id FROM `salinet`.`tbl_login` WHERE `nome` = ? AND `login` = ? AND `senha` = ?",
        [nome, login, senha]
    );
    
    if (verifyRows.length !== 1) {
        throw new Error('Credenciais inválidas para remoção!');
    }
    
    // Then delete the user
    const [result] = await pool.query(
        "DELETE FROM `salinet`.`tbl_login` WHERE `id` = ?",
        [verifyRows[0].id]
    );
    
    if (result.affectedRows > 0) {
        res.json({ 
            success: true,
            message: 'Usuário removido com sucesso!' 
        });
    } else {
        throw new Error('Não foi possível remover o usuário!');
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});