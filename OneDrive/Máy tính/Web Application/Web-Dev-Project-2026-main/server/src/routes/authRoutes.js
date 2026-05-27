const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userRequestDto = require('../dtos/userRequestDTO');

router.post('/login', userRequestDto.validateLogin, authController.login);
router.post('/logout', authController.logout);

module.exports = router;