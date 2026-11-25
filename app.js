require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// GET: Listar productos
app.get('/api/productos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM producto');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Registrar producto
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;
        const [result] = await pool.query(
            'INSERT INTO producto (nombre, precio, stock) VALUES (?, ?, ?)',
            [nombre, precio, stock]
        );
        res.status(201).json({ id: result.insertId, nombre, precio, stock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Actualizar producto
app.put('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock } = req.body;
        await pool.query(
            'UPDATE producto SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
            [nombre, precio, stock, id]
        );
        res.json({ id: Number(id), nombre, precio, stock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM producto WHERE id = ?', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('API ejecutándose correctamente en el puerto 3000');
});
