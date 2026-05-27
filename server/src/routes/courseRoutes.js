const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseController');
const { authMiddleware, allowedRoles } = require('#middlewares/authMiddlewares');

router.use(authMiddleware);

// GET requests hit /search
router.get('/search', controller.searchCourses);

// GET requests hit /delete
router.get('/delete/:id', controller.deleteCourseRecord);

// GET requests hit /:id
router.get('/:id', controller.getCourseRecord);

// GET requests hit /:id/students
router.get('/:id/students', controller.getStudents);

// GET requests hit / (root)
router.get('/', controller.getAllCourses);

// POST requests hit / (root)
router.post('/', allowedRoles(['admin']), controller.createCourse);

// PUT requests hit /:id
router.put('/:id', allowedRoles(['admin']), controller.updateCourse);

module.exports = router;
