const express = require('express');
const router = express.Router();

router
  .route('/register')
  .get(authController.registerForm)
  .post(authController.register);

router.route('/login').get(authController.loginForm).post(authController.login);

router.get('/logout', authController.logout);

module.exports = router;
