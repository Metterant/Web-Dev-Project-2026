const Instructor = require('#models/Instructor');
const { capitalize } = require('#utils/stringUtils');

class InstructorService {
  static async getAllInstructors(page = 1) {
    const instructors = await Instructor.getAll(page);
    if (!instructors || instructors.length === 0) {
      throw { status: 404, message: 'Instructors not found' };
    }
    return instructors;
  }

  static async getInstructorById(instructorId) {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) throw { status: 404, message: 'Instructor not found' };
    return instructor;
  }

  static async searchInstructors(keyword, page = 1, sort = 'instructor_code', order = 'ASC') {
    return await Instructor.search(keyword, page, sort, order);
  }

  static async createInstructor(instructorData) {
    let { instructor_code, first_name, last_name, email, department_id } = instructorData;

    const exists = await Instructor.findByCode(instructor_code);
    if (exists) throw { status: 409, message: `Instructor code '${instructor_code}' already exists` };

    try {
      await Instructor.create(instructor_code, first_name, last_name, email, department_id);
      return { message: 'Instructor created' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw { status: 409, message: 'Duplicate instructor code' };
      throw error;
    }
  }

  static async deleteInstructor(instructorId) {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) throw { status: 404, message: 'Instructor not found' };

    const result = await Instructor.deleteById(instructorId);
    if (result.affectedRows === 1) return { message: 'Instructor Record deleted' };
    throw { status: 400, message: 'Delete failed' };
  }

  static async updateInstructor(instructorId, instructorData) {
    const current = await Instructor.findById(instructorId);
    if (!current) throw { status: 404, message: 'Instructor not found' };

    let { instructor_code, first_name, last_name, email, department_id } = instructorData;

    // Fallback to current values if not provided
    instructor_code = instructor_code ? instructor_code.trim().toUpperCase() : current.instructor_code;
    first_name = first_name ? capitalize(first_name) : current.first_name;
    last_name = last_name ? capitalize(last_name) : current.last_name;
    email = email ? email.trim() : current.email;
    department_id = department_id ? Number(department_id) : current.department_id;

    try {
      await Instructor.update(instructorId, instructor_code, first_name, last_name, email, department_id);
      return { message: 'Instructor updated' };
    } catch (error) {
      throw { status: 400, message: 'Instructor update failed' };
    }
  }
}

module.exports = InstructorService;