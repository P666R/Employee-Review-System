const express = require('express');
const authRouter = require('./authRoutes');
const adminRouter = require('./adminRoutes');
const employeeRouter = require('./employeeRoutes');
const passport = require('passport');

const router = express.Router();

// here we will show the landing page
router.get('/', (req, res) => {
  res.send('hello');
});

router.route('/auth', authRouter);
router.route('/admin', adminRouter);
router.route('/employee', employeeRouter);

module.exports = router;
