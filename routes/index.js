const express = require('express');
const authRouter = require('./authRoutes');
const adminRouter = require('./adminRoutes');
const employeeRouter = require('./employeeRoutes');
// const passport = require('passport');

const router = express.Router();

// here we will show the landing page
router.get('/', (req, res) => {
  res.render('homePage', {
    title: 'Welcome - Nexter ERS',
  });
});

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/employee', employeeRouter);

module.exports = router;
