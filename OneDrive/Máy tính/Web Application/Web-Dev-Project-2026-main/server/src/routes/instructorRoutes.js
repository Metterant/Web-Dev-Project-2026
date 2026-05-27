const express = require('express');
const router = express.Router();
const controller = require('../controllers/instructorController');
const { validateCreate, validateUpdate } = require('../dtos/instructorRequestDTO');
const { authMiddleware, allowedRoles } = require('#middleware/authMiddleware');


router.get('/search',authMiddleware,allowedRoles(['admin']), controller.searchInstructors);
router.get('/:id', authMiddleware, allowedRoles(['admin']), controller.getInstructorRecord); 
router.get('/', authMiddleware, allowedRoles(['admin']), controller.getAllInstructors); 
router.post('/', authMiddleware, allowedRoles(['admin']), validateCreate, controller.createInstructor); 
router.put('/:id', authMiddleware, allowedRoles(['admin']), validateUpdate, controller.updateInstructor); 
router.delete('/:id', authMiddleware, allowedRoles(['admin']), controller.deleteInstructorRecord);

module.exports = router;