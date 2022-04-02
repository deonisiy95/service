import {Router} from 'express';
import auth from 'src/controllers/auth';
import order from 'src/controllers/order';
import account from 'src/controllers/account';
import authMiddleware from 'src/middleware/auth';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({message: 'test'});
});

/**
 * Auth
 */
router.post('/signin', auth.singIn);
router.post('/refresh-tokens', auth.refreshToken);
router.post('/signup', auth.singUp);
router.post('/logout', authMiddleware, auth.logout);

/**
 * Orders
 */
router.get('/orders', authMiddleware, order.getAll);
router.post('/orders', authMiddleware, order.create);
router.put('/orders/:id', authMiddleware, order.put);
router.delete('/orders/:id', authMiddleware, order.remove);

/**
 *  Account
 */
router.get('/info', authMiddleware, account.fullInfo);

export default router;
