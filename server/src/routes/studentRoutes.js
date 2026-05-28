const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');
const { authMiddleware, allowedRoles } = require('#middlewares/authMiddlewares');

router.use(authMiddleware);

// GET requests hit /search
router.get('/search', allowedRoles(['admin', 'instructor']), controller.searchStudents);

// GET requests hit /delete
router.get('/delete/:id', allowedRoles(['admin']), controller.deleteStudentRecord);

// GET requests hit /:id
router.get('/:id', controller.getStudentRecord);

// GET requests hit /:id/courses
router.get('/:id/courses', controller.getCourses);

// GET requests hit /:id/schedule
router.get('/:id/schedule', controller.getSchedule);

// GET requests hit / (root)
router.get('/', allowedRoles(['admin', 'instructor']), controller.getAllStudents);

// POST requests hit / (root)
router.post('/', allowedRoles(['admin']), controller.createStudent)

// PUT requests hit /:id
router.put('/:id', allowedRoles(['admin']), controller.updateStudent);


module.exports = router;