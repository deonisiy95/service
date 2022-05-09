import {Router} from 'express';
import auth from 'src/controllers/auth';
import widget from 'src/controllers/widget';
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
 * Widgets
 */
router.get('/widgets', authMiddleware, widget.getAll);
router.post('/widgets', authMiddleware, widget.create);
router.put('/widgets/:id', authMiddleware, widget.put);
// router.delete('/widgets/:id', authMiddleware, widget.remove);

/**
 *  Account
 */
router.get('/info', authMiddleware, account.fullInfo);

export default router;
