const express = require('express');
const authRouter = require('./authRoutes');
const adminRouter = require('./adminRoutes');
const employeeRouter = require('./employeeRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('homePage', {
    title: 'Welcome - Nexter ERS',
  });
});

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/employee', employeeRouter);

module.exports = router;
