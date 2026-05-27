const express = require('express');
const router = express.Router();
const controller = require('../controllers/departmentController');
const { authMiddleware, allowedRoles } = require('#middlewares/authMiddlewares');

router.use(authMiddleware);

router.get('/search', controller.searchDepartments);
router.get('/delete/:id', controller.deleteDepartmentRecord);
router.get('/:id', controller.getDepartmentRecord);
router.get('/', controller.getAllDepartments);
router.post('/', allowedRoles(['admin']), controller.createDepartment);
router.put('/:id', allowedRoles(['admin']), controller.updateDepartment);

module.exports = router;