const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');

// GET requests hit /search
router.get('/search', controller.searchStudents)

// GET requests hit /delete
router.get('/delete/:id', controller.deleteStudentRecord)

// GET requests hit /:id
router.get('/:id', controller.getStudentRecord);

// GET requests hit /:id/courses
router.get('/:id/courses', controller.getCourses);

// GET requests hit /:id/schedule
router.get('/:id/schedule', controller.getSchedule);

// GET requests hit / (root)
router.get('/', controller.getAllStudents);

// POST requests hit / (root)
router.post('/', controller.createStudent)

// PUT requests hit /:id
router.put('/:id', controller.updateStudent);


module.exports = router;