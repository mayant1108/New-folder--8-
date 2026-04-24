import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getCategories, seedProducts } from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Seed route (public for demo purposes)
router.post('/seed', seedProducts);

export default router;

