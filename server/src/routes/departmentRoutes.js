const express = require('express');
const router = express.Router();
const controller = require('../controllers/departmentController');

router.get('/search', controller.searchDepartments);
router.get('/delete/:id', controller.deleteDepartmentRecord);
router.get('/:id', controller.getDepartmentRecord);
router.get('/', controller.getAllDepartments);
router.post('/', controller.createDepartment);
router.put('/:id', controller.updateDepartment);

module.exports = router;