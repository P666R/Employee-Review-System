const express = require('express');
const authRouter = require('./authRoutes');
const adminRouter = require('./adminRoutes');
const employeeRouter = require('./employeeRoutes');

const router = express.Router();

router.route('/auth', authRouter);
router.route('/admin', adminRouter);
router.route('/employee', employeeRouter);

module.exports = router;
