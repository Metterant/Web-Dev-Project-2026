const express = require('express');
const router = express.Router();
const controller = require('../controllers/instructorController');

// GET requests hit /search
router.get('/search', controller.searchInstructors)

// GET requests hit /delete
router.get('/delete/:id', controller.deleteInstructorRecord)

// GET requests hit /:id
router.get('/:id', controller.getInstructorRecord);

// GET requests hit /:id/courses
router.get('/:id/courses', controller.getCourses);

// GET requests hit / (root)
router.get('/', controller.getAllInstructors);

// POST requests hit / (root)
router.post('/', controller.createInstructor)

// PUT requests hit /:id
router.put('/:id', controller.updateInstructor);

module.exports = router;