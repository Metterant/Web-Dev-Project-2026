const Course = require('#models/Course');

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
    let { course_code, course_name, credits, department_id, instructor_id } = courseData;

    department_id = department_id !== undefined && department_id !== null ? Number(department_id) : null;
    instructor_id = instructor_id !== undefined && instructor_id !== null ? Number(instructor_id) : null;

    // Check for duplicates
    const exists = await Course.findByCode(course_code);
    if (exists) {
        throw { status: 409, message: `Course code '${course_code}' already exists` };
    }

    // Create course
    try {
        await Course.create(course_code, course_name, credits, department_id, instructor_id);
        return { message: 'Course created' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw { status: 409, message: 'Duplicate course code' };
        }
        throw error;
    }
}

 static async deleteCourse(courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
        throw { status: 404, message: 'Course not found' };
    }

    const result = await Course.deleteById(courseId);
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

    let { course_code, course_name, credits, department_id, instructor_id } = courseData;

    // Fallback to current values if not provided
    course_code = course_code || current.course_code;
    course_name = course_name || current.course_name;
    credits = credits || current.credits;
    department_id = department_id !== undefined && department_id !== null ? Number(department_id) : current.department_id;
    instructor_id = instructor_id !== undefined && instructor_id !== null ? Number(instructor_id) : current.instructor_id;

    try {
        await Course.update(courseId, course_code, course_name, credits, department_id, instructor_id);
        return { message: 'Course updated' };
    } catch (error) {
        throw { status: 400, message: 'Course update failed' };
    }
}
}

module.exports = CourseService;
