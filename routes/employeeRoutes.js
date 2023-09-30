const express = require('express');
const passport = require('passport');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.get('/', employeeController.employeeDashboard);
router.get('/feedback', employeeController.showFeedbackForm);
router.post('/submitFeedback', employeeController.submitFeedback);

module.exports = router;
