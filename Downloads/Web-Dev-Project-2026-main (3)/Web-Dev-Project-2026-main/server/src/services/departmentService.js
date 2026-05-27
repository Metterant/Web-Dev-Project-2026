const Department = require('#models/Department');
const Instructor = require('#models/Instructor');
const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

class DepartmentService {
  static async getAllDepartments(page = 1) {
    const departments = await Department.getAll(page);
    if (!departments || departments.length === 0) {
      throw { status: 404, message: 'Departments not found' };
    }
    return departments;
  }

  static async getDepartmentById(departmentId) {
    const department = await Department.findById(departmentId);
    if (!department) {
      throw { status: 404, message: 'Department not found' };
    }
    return department;
  }

  static async searchDepartments(keyword, page = 1, sort = 'department_name', order = 'ASC') {
    return Department.search(keyword, page, sort, order);
  }

  static async createDepartment(departmentData) {
    let { department_name, head_instructor_id } = departmentData;

    department_name = department_name ? department_name.trim() : '';
    head_instructor_id = head_instructor_id !== undefined && head_instructor_id !== null && head_instructor_id !== ''
      ? Number(head_instructor_id)
      : null;

    if (!department_name) {
      throw { status: 406, message: 'Empty department name' };
    }

    if (head_instructor_id !== null && !Number.isInteger(head_instructor_id)) {
      throw { status: 406, message: 'Invalid head instructor id' };
    }

    if (head_instructor_id !== null) {
      const instructor = await Instructor.findById(head_instructor_id);
      if (!instructor) {
        throw { status: 404, message: 'Head instructor not found' };
      }
    }

    try {
      await Department.create(capitalize(department_name), head_instructor_id);
      return { message: 'Department created' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: 409, message: 'Duplicate department name' };
      }
      throw error;
    }
  }

  static async deleteDepartment(departmentId) {
    const result = await Department.deleteById(departmentId);
    if (!result) {
      throw { status: 404, message: 'Department not found' };
    }

    if (result.affectedRows === 1) {
      return { message: 'Department deleted' };
    }

    throw { status: 400, message: 'Delete failed' };
  }

  static async updateDepartment(departmentId, departmentData) {
    const current = await Department.findById(departmentId);
    if (!current) {
      throw { status: 404, message: 'Department not found' };
    }

    let { department_name, head_instructor_id } = departmentData;

    if (typeof department_name === 'string' && department_name.trim()) {
      department_name = capitalize(department_name.trim());
    } else {
      department_name = current.department_name;
    }

    if (head_instructor_id === '' || head_instructor_id === undefined) {
      head_instructor_id = current.head_instructor_id ?? null;
    } else if (head_instructor_id === null) {
      head_instructor_id = null;
    } else {
      head_instructor_id = Number(head_instructor_id);
      if (!Number.isInteger(head_instructor_id)) {
        head_instructor_id = current.head_instructor_id ?? null;
      }
    }

    if (head_instructor_id !== null) {
      const instructor = await Instructor.findById(head_instructor_id);
      if (!instructor) {
        throw { status: 404, message: 'Head instructor not found' };
      }
    }

    try {
      await Department.update(departmentId, department_name, head_instructor_id);
      return { message: 'Department updated' };
    } catch (error) {
      throw { status: 400, message: 'Department update failed' };
    }
  }
}

module.exports = DepartmentService;