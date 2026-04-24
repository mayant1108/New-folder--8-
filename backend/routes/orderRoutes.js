import express from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, updateOrderStatus, getAllOrders, getOrderStats } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/admin/stats', protect, admin, getOrderStats);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.put('/:id/status', protect, admin, updateOrderStatus);

router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

export default router;

