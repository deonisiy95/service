import order from './src/controllers/order';
import authMiddleware from './src/middleware/auth';
import {Router} from 'express';
import auth from './src/controllers/auth';
const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({message: 'test'});
});

/**
 * Auth
 */
router.post('/signin', auth.singIn);
router.post('/refresh-tokens', auth.refreshToken);
router.post('/singup', auth.singUp);

/**
 * Orders
 */
router.get('/orders', authMiddleware, order.getAll);
router.post('/orders', authMiddleware, order.create);
router.put('/orders/:id', authMiddleware, order.put);
router.delete('/orders/:id', authMiddleware, order.remove);

export default router;
