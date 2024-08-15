import express from 'express';
import userCtrl from '../controllers/userCtrl.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', userCtrl.register)
router.post('/refresh_token', userCtrl.refreshtoken)
router.post('/login', userCtrl.login)
router.get('/logout', userCtrl.logout)
router.get('/information', auth, userCtrl.getUser)

export default router;
