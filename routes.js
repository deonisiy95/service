const {Router} = require('express');
const router = Router();
const auth = require('./src/controllers/auth');
const order = require('./src/controllers/order');
const authMiddleware = require('./src/middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  res.send('asda');
});

router.post('/signin', auth.singIn);
router.post('/refresh-tokens', auth.refreshToken);
router.post('/singup', auth.singUp);

// orders
router.get('/orders', order.getAll);
router.post('/orders', order.create);
router.put('/orders/:id', order.put);
router.delete('/orders/:id', order.remove);

module.exports = router;
