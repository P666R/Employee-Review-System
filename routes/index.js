const express = require('express');
const usersRouter = require('./userRoutes');
const adminRouter = require('./adminRoutes');
const reviewsRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/users', usersRouter);

router.use('/admin', adminRouter);

router.use('/reviews', reviewsRouter);

module.exports = router;
