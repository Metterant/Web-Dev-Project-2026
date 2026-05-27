const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const allowedRoles = require('../middleware/allowedRoles');

//instructors and admins can access these routes
// GET requests hit /search
router.get('/search', authMiddleware, allowedRoles(['admin', 'instructor']), controller.searchStudents);

// GET requests hit /delete
router.get('/delete/:id', authMiddleware, allowedRoles(['admin', 'instructor']), controller.deleteStudentRecord);

// GET requests hit /:id
router.get('/:id', authMiddleware, allowedRoles(['admin', 'instructor']), controller.getStudentRecord);

// GET requests hit /:id/courses
router.get('/:id/courses', authMiddleware, allowedRoles(['admin', 'instructor']), controller.getCourses);

// GET requests hit /:id/schedule
router.get('/:id/schedule', authMiddleware, allowedRoles(['admin', 'instructor']), controller.getSchedule);

// GET requests hit / (root)
router.get('/', authMiddleware, allowedRoles(['admin', 'instructor']), controller.getAllStudents);

// POST requests hit / (root)
router.post('/', authMiddleware, allowedRoles(['admin', 'instructor']), controller.createStudent);

// PUT requests hit /:id
router.put('/:id', authMiddleware, allowedRoles(['admin', 'instructor']), controller.updateStudent);


module.exports = router;