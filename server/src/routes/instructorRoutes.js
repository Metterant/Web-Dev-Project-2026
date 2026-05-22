const express = require('express');
const router = express.Router();
const controller = require('../controllers/instructorController');

// GET requests hit /search
router.get('/search', controller.searchInstructors)

// GET requests hit /delete
router.get('/delete/:id', controller.deleteInstructorRecord)

// GET requests hit /:id
router.get('/:id', controller.getInstructorRecord);

// GET requests hit / (root)
router.get('/', controller.getAllInstructors);

module.exports = router;