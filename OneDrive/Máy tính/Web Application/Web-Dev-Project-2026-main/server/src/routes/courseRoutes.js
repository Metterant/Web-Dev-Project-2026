const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseController');
const {validateCreate, validateUpdate} = require('../dtos/courseRequestDTO');
const {authMiddleware, allowedRoles} = require('../middleware/authMiddleware');



//Student, Instructor, Admin can access these routes
router.get('/search', authMiddleware, allowedRoles(['student', 'instructor', 'admin']), controller.searchCourses);
router.get('/:id', authMiddleware, allowedRoles(['student', 'instructor', 'admin']), controller.getCourseRecord);
router.get('/', authMiddleware, allowedRoles(['student', 'instructor', 'admin']), controller.getAllCourses);

//Instructor & Admin only can access these routes
router.post('/', authMiddleware, allowedRoles(['instructor', 'admin']), validateCreate, controller.createCourse);
router.put('/:id', authMiddleware, allowedRoles(['instructor', 'admin']), validateUpdate, controller.updateCourse);
router.delete('/:id', authMiddleware, allowedRoles(['instructor', 'admin']), controller.deleteCourseRecord);

module.exports = router;
