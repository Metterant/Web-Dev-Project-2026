const DepartmentService = require('#services/departmentService');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getDepartmentRecord = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const department = await DepartmentService.getDepartmentById(departmentId);
    return res.status(200).json(department);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const departments = await DepartmentService.getAllDepartments(page);
    return res.status(200).json(departments);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const searchDepartments = async (req, res) => {
  try {
    const { keyword, page, sort, order } = req.query;
    const results = await DepartmentService.searchDepartments(keyword, page, sort, order);
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const deleteDepartmentRecord = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const result = await DepartmentService.deleteDepartment(departmentId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const createDepartment = async (req, res) => {
  try {
    const result = await DepartmentService.createDepartment(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const updateDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const result = await DepartmentService.updateDepartment(departmentId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error);
    return res.status(400).json({ message: 'Department update failed' });
  }
};

module.exports = {
  getDepartmentRecord,
  getAllDepartments,
  searchDepartments,
  deleteDepartmentRecord,
  createDepartment,
  updateDepartment,
};