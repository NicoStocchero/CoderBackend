import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('./src/data/products.json');

/**
 * GET /api/products
 * Devuelve todos los productos
 */
router.get('/', async (req, res) => {
  const productos = await manager.getAll();
  res.json({ status: 'success', data: productos });
});

/**
 * GET /api/products/:pid
 * Devuelve un producto según su ID
 */
router.get('/:pid', async (req, res) => {
  const producto = await manager.getById(req.params.pid);
  res.json({ status: 'success', data: producto });
});

/**
 * POST /api/products
 * Agrega un nuevo producto con campos obligatorios
 */
router.post('/', async (req, res) => {
  const nuevoProducto = await manager.addProduct(req.body);
  res.json({ status: 'success', data: nuevoProducto });
});

/**
 * PUT /api/products/:pid
 * Actualiza campos de un producto existente (excepto el ID)
 */
router.put('/:pid', async (req, res) => {
  const actualizado = await manager.updateProduct(req.params.pid, req.body);
  res.json({ status: 'success', data: actualizado });
});

/**
 * DELETE /api/products/:pid
 * Elimina un producto por ID
 */
router.delete('/:pid', async (req, res) => {
  const eliminado = await manager.deleteProduct(req.params.pid);
  res.json({ status: 'success', data: eliminado });
});

export default router;
