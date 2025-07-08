// app.js
import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import viewsRouter from './src/routes/views.router.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import ProductManager from './src/managers/ProductManager.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Middleware errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
});

// Socket.io y server
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new ProductManager('./src/data/products.json');

io.on('connection', async socket => {
  console.log('Cliente conectado');

  socket.on('new-product', async data => {
    await productManager.addProduct(data);
    const products = await productManager.getProducts();
    io.emit('update-products', products);
  });
});

// Puerto
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
