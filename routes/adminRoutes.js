const express = require('express');
const passport = require('passport');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(passport.checkAuthentication, authController.isAdmin);

router.get('/', adminController.adminDashboard);

router.post('/makeAdmin', adminController.makeAdmin);

router.post('/assignReview', adminController.assignReview);

router.get('/deleteEmployee/:id', adminController.deleteEmployee);

module.exports = router;
