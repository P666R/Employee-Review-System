const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', employeeController.employeeDashboard);
router.post('/submitFeedback', employeeController.submitFeedback);

module.exports = router;
