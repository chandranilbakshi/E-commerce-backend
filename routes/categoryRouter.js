import express from 'express';
const router = express.Router();
import categoryCtrl from "../controllers/categoryCtrl.js"
import auth from "../middleware/auth.js"
import adminAuth from '../middleware/adminAuth.js';

router.get("/category", categoryCtrl.getCategories)
router.post("/category", auth, adminAuth, categoryCtrl.createCategory)
router.delete("/category/:id", auth, adminAuth, categoryCtrl.deleteCategory)
router.post("/category/:id", auth, adminAuth, categoryCtrl.updateCategory)

export default router