import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager('./src/data/carts.json');

/**
 * POST /api/carts
 * Crea un nuevo carrito (con ID autogenerado y sin productos)
 */
router.post('/', async (req, res) => {
  const nuevoCarrito = await manager.createCart();
  res.status(201).json({ status: 'success', data: nuevoCarrito });
});

/**
 * GET /api/carts/:cid
 * Devuelve todos los productos de un carrito específico
 */
router.get('/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const carrito = await manager.getCartById(cid);

  if (!carrito) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }

  res.json({ status: 'success', data: carrito.products });
});

/**
 * POST /api/carts/:cid/product/:pid
 * Agrega un producto al carrito (si ya existe, incrementa cantidad)
 */
router.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const actualizado = await manager.addProductToCart(cid, pid);

  if (!actualizado) {
    return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  }

  res.json({ status: 'success', data: actualizado });
});

export default router;
