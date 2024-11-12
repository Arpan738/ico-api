const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../modules/auth/auth.validation');
const authController = require('../../modules/auth/auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/getCurrentUser', authController.getCurrentUser);
// router.post('/refresh-token', authController.refreshTokens)
module.exports = router;