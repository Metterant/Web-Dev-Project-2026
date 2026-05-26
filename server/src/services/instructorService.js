const Instructor = require('#models/Instructor');
const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

class InstructorService {
  // Get all instructors
  static async getAllInstructors(page = 1) {
    const instructors = await Instructor.getAll(page);
    if (!instructors || instructors.length === 0) {
      throw { status: 404, message: 'Instructors not found' };
    }
    return instructors;
  }

  // Get a single instructor by ID
  static async getInstructorById(instructorId) {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      throw { status: 404, message: 'Instructor not found' };
    }
    return instructor;
  }

  // Search instructors
  static async searchInstructors(keyword, page = 1, sort = 'instructor_code', order = 'ASC') {
    const results = await Instructor.search(keyword, page, sort, order);
    return results;
  }

  // Create a new instructor
  static async createInstructor(instructorData) {
    let { instructor_code, first_name, last_name, email, department_id } = instructorData;

    // Data transformation
    instructor_code = instructor_code.trim().toUpperCase();
    first_name = capitalize(first_name);
    last_name = capitalize(last_name);
    email = email.trim();
    department_id = Number(department_id);

    // Validation
    if (!validationUtils.isValidInstructorCode(instructor_code)) {
      throw { status: 400, message: 'Invalid instructor Code' };
    }

    if (!validationUtils.isValidName(first_name)) {
      throw { status: 400, message: 'Invalid first name' };
    }

    if (!validationUtils.isValidName(last_name)) {
      throw { status: 400, message: 'Invalid last name' };
    }

    if (!validationUtils.isValidEmail(email)) {
      throw { status: 400, message: 'Invalid email' };
    }

    if (!Number.isInteger(department_id)) {
      throw { status: 400, message: 'Invalid department id' };
    }

    // Check for duplicates
    const exists = await Instructor.findByCode(instructor_code);
    if (exists) {
      throw { status: 409, message: `Instructor code '${instructor_code}' already exists` };
    }

    // Create instructor (user is created by DB trigger)
    try {
      await Instructor.create(instructor_code, first_name, last_name, email, department_id);
      return { message: 'Instructor created' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: 409, message: 'Duplicate instructor code' };
      }
      throw error;
    }
  }

  // Delete an instructor
  static async deleteInstructor(instructorId) {
    const result = await Instructor.deleteById(instructorId);
    if (!result) {
      throw { status: 404, message: 'Instructor not found' };
    }

    if (result.affectedRows === 1) {
      return { message: 'Instructor Record deleted' };
    }

    throw { status: 400, message: 'Delete failed' };
  }

  // Update an instructor
  static async updateInstructor(instructorId, instructorData) {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      throw { status: 404, message: 'Instructor not found' };
    }

    let { instructor_code, first_name, last_name, email, department_id } = instructorData;

    // Validate and keep current value if invalid
    if (!validationUtils.isValidInstructorCode(instructor_code)) {
      instructor_code = instructor.instructor_code;
    } else {
      instructor_code = instructor_code.trim().toUpperCase();
    }

    if (!validationUtils.isValidName(first_name)) {
      first_name = instructor.first_name;
    } else {
      first_name = capitalize(first_name);
    }

    if (!validationUtils.isValidName(last_name)) {
      last_name = instructor.last_name;
    } else {
      last_name = capitalize(last_name);
    }

    if (!validationUtils.isValidEmail(email)) {
      email = instructor.email;
    } else {
      email = email.trim();
    }

    if (!Number.isInteger(department_id)) {
      department_id = instructor.department_id;
    }

    try {
      await Instructor.update(instructorId, instructor_code, first_name, last_name, email, department_id);
      return { message: 'Instructor updated' };
    } catch (error) {
      throw { status: 400, message: 'Instructor update failed' };
    }
  }

  static async getCourses(instructor_id, page = 1) {
    const instructor = await Instructor.findById(instructor_id);

    if (!instructor)
      throw { status: 404, message: 'Instructor not found' };

    const courses = await Instructor.getCourses(instructor_id, page);

    if (!courses || courses.length === 0)
      return { status: 200, message: 'No courses found' };

    return courses;
  }

  static async getSchedule(instructor_id, semester = '', page = 1) {
    const instructor = await Instructor.findById(instructor_id);

    if (!instructor)
      throw { status: 404, message: 'Instructor not found' };

    const schedule = await Instructor.getSchedule(instructor_id, semester, page);

    if (!schedule || schedule.length === 0)
      return { status: 200, message: 'No schedule found' };

    return schedule;
  }
}

module.exports = InstructorService;
