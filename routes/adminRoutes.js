const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', passport.checkAuthentication, adminController.adminDashboard);

router.post(
  '/makeAdmin',
  passport.checkAuthentication,
  adminController.makeAdmin
);

router.post(
  '/assignReview',
  passport.checkAuthentication,
  adminController.assignReview
);

router.delete(
  '/deleteEmployee/:id',
  passport.checkAuthentication,
  adminController.deleteEmployee
);

module.exports = router;
