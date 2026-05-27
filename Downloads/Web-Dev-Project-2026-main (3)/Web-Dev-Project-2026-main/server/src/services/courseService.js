const Course = require('#models/Course');
const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

class CourseService {
  // Get all courses
  static async getAllCourses(page = 1) {
    const courses = await Course.getAll(page);
    if (!courses || courses.length === 0) {
      throw { status: 404, message: 'Courses not found' };
    }
    return courses;
  }

  // Get a single course by ID
  static async getCourseById(courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw { status: 404, message: 'Course not found' };
    }
    return course;
  }

  // Search courses
  static async searchCourses(keyword, page = 1, sort = 'course_code', order = 'ASC') {
    const results = await Course.search(keyword, page, sort, order);
    return results;
  }

  // Create a new course
  static async createCourse(courseData) {
    let { course_code, course_name, credits, department_id } = courseData;

    // Data transformation
    course_code = course_code ? course_code.trim().toUpperCase() : '';
    course_name = capitalize(course_name);
    credits = Number(credits);
    department_id = department_id !== undefined && department_id !== null ? Number(department_id) : null;

    // Validation
    if (!validationUtils.isValidCourseCode(course_code)) {
      throw { status: 406, message: 'Invalid course code' };
    }

    if (!course_name) {
      throw { status: 406, message: 'Empty course name' };
    }

    if (!Number.isInteger(credits) || credits <= 0) {
      throw { status: 406, message: 'Invalid credits' };
    }

    // Check for duplicates
    const exists = await Course.findByCode(course_code);
    if (exists) {
      throw { status: 409, message: `Course code '${course_code}' already exists` };
    }

    // Create course
    try {
      await Course.create(course_code, course_name, credits, department_id);
      return { message: 'Course created' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: 409, message: 'Duplicate course code' };
      }
      throw error;
    }
  }

  // Delete a course
  static async deleteCourse(courseId) {
    const result = await Course.deleteById(courseId);
    if (!result) {
      throw { status: 404, message: 'Course not found' };
    }

    if (result.affectedRows === 1) {
      return { message: 'Course deleted' };
    }

    throw { status: 400, message: 'Delete failed' };
  }

  // Update a course
  static async updateCourse(courseId, courseData) {
    const current = await Course.findById(courseId);
    if (!current) {
      throw { status: 404, message: 'Course not found' };
    }

    let { course_code, course_name, credits, department_id } = courseData;

    // Validate and keep current value if invalid
    if (!validationUtils.isValidCourseCode(course_code)) {
      course_code = current.course_code;
    } else {
      course_code = course_code.trim().toUpperCase();
    }

    if (!course_name) {
      course_name = current.course_name;
    } else {
      course_name = capitalize(course_name);
    }

    credits = Number(credits);
    if (!Number.isInteger(credits) || credits <= 0) {
      credits = current.credits;
    }

    department_id = department_id !== undefined && department_id !== null ? Number(department_id) : current.department_id;

    try {
      await Course.update(courseId, course_code, course_name, credits, department_id);
      return { message: 'Course updated' };
    } catch (error) {
      throw { status: 400, message: 'Course update failed' };
    }
  }

  // Assign an instructor to a course with schedule info
  static async assignInstructor(courseId, instructorData) {
    let { instructor_id, day_of_week, start_period, end_period } = instructorData;

    // Validation
    instructor_id = Number(instructor_id);
    start_period = Number(start_period);
    end_period = Number(end_period);

    if (!validationUtils.isValidPeriodRange(start_period, end_period)) {
      throw { status: 406, message: 'Invalid period range' };
    }

    // Validate day_of_week
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day_of_week)) {
      throw { status: 406, message: 'Invalid day of week' };
    }

    try {
      await Course.addInstructor(courseId, instructor_id, day_of_week, start_period, end_period);
      return { message: 'Instructor assigned to course' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: 409, message: 'Instructor already assigned to this course' };
      }
      throw error;
    }
  }

  // Unassign an instructor from a course
  static async unassignInstructor(courseInstructorId) {
    try {
      const result = await Course.removeInstructor(courseInstructorId);
      if (result.affectedRows === 1) {
        return { message: 'Instructor unassigned from course' };
      }
      throw { status: 404, message: 'Assignment not found' };
    } catch (error) {
      throw error;
    }
  }

  static async getStudents(courseId, semester, page = 1) {
    const course = await CourseService.getCourseById(courseId);

    if (!course)
      throw { status: 404, message: 'Course not found' };

    if (!validationUtils.isValidSemesterCode(semester))
      throw { status: 400, message: 'Invalid semester code' };
    
    const students = await Course.getStudents(courseId, semester, page);

    if (!students || students.length === 0) {
      return { status: 200, message: 'No students found' };
    }
    return students;
  }
}

module.exports = CourseService;
