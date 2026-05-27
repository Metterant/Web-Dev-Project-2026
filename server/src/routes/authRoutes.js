const express = require('express');
const router = express.Router();
const controller = require('#controllers/authController');
const { authMiddleware } = require('#middlewares/authMiddlewares');

router.post('/login', controller.login);
router.post('/logout', controller.logout);

// Returns current user based on httpOnly cookie token
router.get('/me', authMiddleware, (req, res) => {
	return res.status(200).json({ user: req.user });
});

module.exports = router;