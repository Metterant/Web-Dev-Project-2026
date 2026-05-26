const express = require('express');
const router = express.Router();
const controller = require('../controllers/instructorController');
const { authMiddleware, allowedRoles } = require('#middleware/authMiddleware');


router.get('/search',authMiddleware,allowedRoles(['admin']), controller.searchInstructors);
router.get('/:id', authMiddleware, allowedRoles(['admin']), controller.getInstructorRecord); 
router.get('/', authMiddleware, allowedRoles(['admin']), controller.getAllInstructors); 
router.post('/', authMiddleware, allowedRoles(['admin']), controller.createInstructor) 
router.put('/:id', authMiddleware, allowedRoles(['admin']), controller.updateInstructor); 
router.delete('/:id', authMiddleware, allowedRoles(['admin']), controller.deleteInstructorRecord);

module.exports = router;