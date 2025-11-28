const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { randomUUID } = require('crypto');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos SQLite
const db = new Database('subscriptions.db');

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT NOT NULL CHECK(currency IN ('USD', 'HNL')),
    frequency TEXT NOT NULL CHECK(frequency IN ('Mensual', 'Anual')),
    paymentDate INTEGER NOT NULL CHECK(paymentDate >= 1 AND paymentDate <= 31),
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// Preparar statements
const getAllStmt = db.prepare('SELECT * FROM subscriptions ORDER BY createdAt DESC');
const getByIdStmt = db.prepare('SELECT * FROM subscriptions WHERE id = ?');
const insertStmt = db.prepare(`
  INSERT INTO subscriptions (id, name, price, currency, frequency, paymentDate, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const updateStmt = db.prepare(`
  UPDATE subscriptions 
  SET name = ?, price = ?, currency = ?, frequency = ?, paymentDate = ?, updatedAt = ?
  WHERE id = ?
`);
const deleteStmt = db.prepare('DELETE FROM subscriptions WHERE id = ?');

// Rutas

// GET /api/subscriptions - Obtener todas las suscripciones
app.get('/api/subscriptions', (req, res) => {
    try {
        const subscriptions = getAllStmt.all();
        res.json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Error al obtener suscripciones' });
    }
});

// GET /api/subscriptions/:id - Obtener una suscripción por ID
app.get('/api/subscriptions/:id', (req, res) => {
    try {
        const subscription = getByIdStmt.get(req.params.id);
        if (!subscription) {
            return res.status(404).json({ error: 'Suscripción no encontrada' });
        }
        res.json(subscription);
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ error: 'Error al obtener suscripción' });
    }
});

// POST /api/subscriptions - Crear nueva suscripción
app.post('/api/subscriptions', (req, res) => {
    try {
        const { name, price, currency, frequency, paymentDate } = req.body;

        // Validación
        if (!name || !price || !currency || !frequency || !paymentDate) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (price <= 0) {
            return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
        }

        if (!['USD', 'HNL'].includes(currency)) {
            return res.status(400).json({ error: 'Moneda inválida' });
        }

        if (!['Mensual', 'Anual'].includes(frequency)) {
            return res.status(400).json({ error: 'Frecuencia inválida' });
        }

        if (paymentDate < 1 || paymentDate > 31) {
            return res.status(400).json({ error: 'Día de pago debe estar entre 1 y 31' });
        }

        const id = randomUUID();
        const now = new Date().toISOString();

        insertStmt.run(id, name, price, currency, frequency, paymentDate, now, now);

        const newSubscription = getByIdStmt.get(id);
        res.status(201).json(newSubscription);
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Error al crear suscripción' });
    }
});

// PUT /api/subscriptions/:id - Actualizar suscripción
app.put('/api/subscriptions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, currency, frequency, paymentDate } = req.body;

        // Verificar que existe
        const existing = getByIdStmt.get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Suscripción no encontrada' });
        }

        // Usar valores existentes si no se proporcionan nuevos
        const updatedName = name ?? existing.name;
        const updatedPrice = price ?? existing.price;
        const updatedCurrency = currency ?? existing.currency;
        const updatedFrequency = frequency ?? existing.frequency;
        const updatedPaymentDate = paymentDate ?? existing.paymentDate;

        // Validación
        if (updatedPrice <= 0) {
            return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
        }

        if (!['USD', 'HNL'].includes(updatedCurrency)) {
            return res.status(400).json({ error: 'Moneda inválida' });
        }

        if (!['Mensual', 'Anual'].includes(updatedFrequency)) {
            return res.status(400).json({ error: 'Frecuencia inválida' });
        }

        if (updatedPaymentDate < 1 || updatedPaymentDate > 31) {
            return res.status(400).json({ error: 'Día de pago debe estar entre 1 y 31' });
        }

        const now = new Date().toISOString();
        updateStmt.run(updatedName, updatedPrice, updatedCurrency, updatedFrequency, updatedPaymentDate, now, id);

        const updatedSubscription = getByIdStmt.get(id);
        res.json(updatedSubscription);
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Error al actualizar suscripción' });
    }
});

// DELETE /api/subscriptions/:id - Eliminar suscripción
app.delete('/api/subscriptions/:id', (req, res) => {
    try {
        const { id } = req.params;

        const existing = getByIdStmt.get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Suscripción no encontrada' });
        }

        deleteStmt.run(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ error: 'Error al eliminar suscripción' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 API disponible en http://localhost:${PORT}/api/subscriptions`);
});

// Cerrar base de datos al terminar
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});
