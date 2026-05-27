const express = require('express');
const router = express.Router();
const controller = require('../controllers/instructorController');
const { authMiddleware, allowedRoles } = require('#middlewares/authMiddlewares');

router.use(authMiddleware);

// GET requests hit /search
router.get('/search', controller.searchInstructors)

// GET requests hit /delete
router.get('/delete/:id', allowedRoles(['admin']), controller.deleteInstructorRecord)

// GET requests hit /:id
router.get('/:id', controller.getInstructorRecord);

// GET requests hit /:id/courses
router.get('/:id/courses', controller.getCourses);

// GET requests hit /:id/schedule
router.get('/:id/schedule', controller.getSchedule);

// GET requests hit / (root)
router.get('/', controller.getAllInstructors);

// POST requests hit / (root)
router.post('/', allowedRoles(['admin']), controller.createInstructor)

// PUT requests hit /:id
router.put('/:id', allowedRoles(['admin']), controller.updateInstructor);

module.exports = router;