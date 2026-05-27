const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const allowedRoles = require('../middleware/allowedRoles');

//students, instructors, and admins can access these routes

// GET requests hit /search
router.get('/search',authMiddleware, allowedRoles(['student', 'admin', 'instructor']), controller.searchCourses);

// GET requests hit / (root)
router.get('/', authMiddleware, allowedRoles(['student', 'admin', 'instructor']), controller.getAllCourses);

// GET requests hit /:id
router.get('/:id', authMiddleware, allowedRoles(['student', 'admin', 'instructor']), controller.getCourseRecord);


//instructors and admins can access these routes
// GET requests hit /delete
router.get('/delete/:id', authMiddleware, allowedRoles(['admin', 'instructor']), controller.deleteCourseRecord);

// GET requests hit /:id/students
router.get('/:id/students', authMiddleware, allowedRoles(['admin', 'instructor']), controller.getStudents);

// POST requests hit / (root)
router.post('/', authMiddleware, allowedRoles(['admin', 'instructor']), controller.createCourse);

// PUT requests hit /:id
router.put('/:id', authMiddleware, allowedRoles(['admin', 'instructor']), controller.updateCourse);

module.exports = router;
