const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');

// GET requests hit /search
router.get('/search', controller.searchStudents)

// GET requests hit /:id
router.get('/:id', controller.getStudentProfile);

// GET requests hit / (root)
router.get('/', controller.getAllStudents);

module.exports = router;