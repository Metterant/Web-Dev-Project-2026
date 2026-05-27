const express = require('express');
const router = express.Router();
const controller = require('../controllers/departmentController');


//only admins can access these routes
router.get('/search', authMiddleware, allowedRoles(['admin']), controller.searchDepartments);
router.get('/delete/:id', authMiddleware, allowedRoles(['admin']), controller.deleteDepartmentRecord);
router.get('/:id', authMiddleware, allowedRoles(['admin']), controller.getDepartmentRecord);
router.get('/', authMiddleware, allowedRoles(['admin']), controller.getAllDepartments);
router.post('/', authMiddleware, allowedRoles(['admin']), controller.createDepartment);
router.put('/:id', authMiddleware, allowedRoles(['admin']), controller.updateDepartment);

module.exports = router;