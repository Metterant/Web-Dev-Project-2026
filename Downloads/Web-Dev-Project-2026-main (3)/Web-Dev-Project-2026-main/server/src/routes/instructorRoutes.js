const express = require('express');
const router = express.Router();
const controller = require('../controllers/instructorController');
const authMiddleware = require('../middleware/authMiddleware');
const allowedRoles = require('../middleware/allowedRoles');


//only admins can access these routes
// GET requests hit /search
router.get('/search', authMiddleware, allowedRoles(['admin']), controller.searchInstructors);

// GET requests hit /delete
router.get('/delete/:id', authMiddleware, allowedRoles(['admin']), controller.deleteInstructorRecord);

// GET requests hit /:id
router.get('/:id', authMiddleware, allowedRoles(['admin']), controller.getInstructorRecord);

// GET requests hit /:id/courses
router.get('/:id/courses', authMiddleware, allowedRoles(['admin']), controller.getCourses);

// GET requests hit /:id/schedule
router.get('/:id/schedule', authMiddleware, allowedRoles(['admin']), controller.getSchedule);

// GET requests hit / (root)
router.get('/', authMiddleware, allowedRoles(['admin']), controller.getAllInstructors);

// POST requests hit / (root)
router.post('/', authMiddleware, allowedRoles(['admin']), controller.createInstructor);

// PUT requests hit /:id
router.put('/:id', authMiddleware, allowedRoles(['admin']), controller.updateInstructor);

module.exports = router;