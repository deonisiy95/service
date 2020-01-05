const {Router} = require('express');
const router = Router();
const auth = require('./src/controllers/auth');
const authMiddleware = require('./src/middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  res.send('asda');
});

router.post('/signin', auth.singIn);
router.post('/refresh-tokens', auth.refreshToken);
router.post('/singup', auth.singUp);

module.exports = router;
