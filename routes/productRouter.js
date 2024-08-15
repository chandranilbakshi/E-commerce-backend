import express from 'express';
const router = express.Router();
import productCtrl from '../controllers/productCtrl.js';

router.get('/products', productCtrl.getProducts)
router.post('/products', productCtrl.createProducts)

router.delete('/products/:id', productCtrl.deleteProduct)
router.put('/products/:id', productCtrl.updateProduct)

export default router