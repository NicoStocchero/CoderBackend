import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

/**
 * Rutas principales de la API
 */
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

/**
 * Middleware global para errores inesperados
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
});

// Puerto de escucha
const PORT = process.env.PORT || 8080;

// Inicia el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
