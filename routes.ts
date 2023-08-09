import {Router} from 'express';
import auth from 'src/controllers/auth';
import widget from 'src/controllers/widget';
import account from 'src/controllers/account';
import form from 'src/controllers/form';
import message from 'src/controllers/message';
import authMiddleware from 'src/middleware/auth';

const router = Router();

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
router.patch('/widgets/:id', authMiddleware, widget.update);
router.delete('/widgets/:id', authMiddleware, widget.remove);
router.post('/widgets/check', authMiddleware, widget.check);
router.post('/widgets/form/:id', authMiddleware, form.update);
router.get('/widgets/form/:id', form.getOne);

/**
 * Messages
 */
router.post('/widgets/form/:id/message', message.add);
router.get('/widgets/messages', authMiddleware, message.getList);

/**
 *  Account
 */
router.get('/account', authMiddleware, account.fullInfo);

router.get('/config/:id', (req, res) => {
  res.json({
    build_number: 123
  });
});

export default router;
