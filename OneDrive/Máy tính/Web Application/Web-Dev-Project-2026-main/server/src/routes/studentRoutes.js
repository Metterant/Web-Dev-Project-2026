const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');
const {validateCreate, validateUpdate} = require('../dtos/studentRequestDTO');
const {authMiddleware, allowedRoles} = require('../middleware/authMiddleware');


//Instructor, Admin can access these routes
router.get('/search', authMiddleware, allowedRoles(['instructor', 'admin']), controller.searchStudents);
router.get('/:id', authMiddleware, allowedRoles(['instructor', 'admin']), controller.getStudentRecord);
router.get('/', authMiddleware, allowedRoles(['instructor', 'admin']), controller.getAllStudents);

//Instructor & Admin only can access these routes
router.post('/', authMiddleware, allowedRoles(['instructor', 'admin']), validateCreate, controller.createStudent);
router.put('/:id', authMiddleware, allowedRoles(['instructor', 'admin']), validateUpdate, controller.updateStudent);
router.delete('/:id', authMiddleware, allowedRoles(['instructor', 'admin']), controller.deleteStudentRecord);

module.exports = router;