const Student = require('#models/Student');
const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

class StudentService {
  // Get all students
  static async getAllStudents(page = 1) {
    const students = await Student.getAll(page);
    if (!students || students.length === 0) {
      throw { status: 404, message: 'Students not found' };
    }
    return students;
  }

  // Get a single student by ID
  static async getStudentById(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw { status: 404, message: 'Student not found' };
    }
    return student;
  }

  // Search students
  static async searchStudents(keyword, page = 1, sort = 'student_code', order = 'ASC') {
    const results = await Student.search(keyword, page, sort, order);
    return results;
  }

  // Create a new student
  static async createStudent(studentData) {
    let { student_code, first_name, last_name, dob, major, admission_year, email } = studentData;

    // Data transformation
    student_code = student_code.trim().toUpperCase();
    first_name = capitalize(first_name);
    last_name = capitalize(last_name);
    dob = dob.trim();
    major = capitalize(major);
    admission_year = Number(admission_year);
    email = email.trim();

    // Validation
    if (!validationUtils.isValidStudentCode(student_code)) {
      throw { status: 400, message: 'Invalid Student Code' };
    }

    if (!validationUtils.isValidName(first_name)) {
      throw { status: 400, message: 'Invalid first name' };
    }

    if (!validationUtils.isValidName(last_name)) {
      throw { status: 400, message: 'Invalid last name' };
    }

    if (!validationUtils.isValidMySQLDate(dob)) {
      throw { status: 400, message: 'Invalid Date of Birth' };
    }

    if (!major) {
      throw { status: 400, message: 'Empty major' };
    }

    if (!validationUtils.isValidEmail(email)) {
      throw { status: 400, message: 'Invalid email' };
    }

    // Check for duplicates
    const exists = await Student.findByCode(student_code);
    if (exists) {
      throw { status: 409, message: `Student code '${student_code}' already exists` };
    }

    // Create student
    try {
      await Student.create(student_code, first_name, last_name, dob, major, admission_year, email);
      return { message: 'Student created' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw { status: 409, message: 'Duplicate student code' };
      }
      throw error;
    }
  }

  // Delete a student
  static async deleteStudent(studentId) {
    const result = await Student.deleteById(studentId);
    if (!result) {
      throw { status: 404, message: 'Student not found' };
    }

    if (result.affectedRows === 1) {
      return { message: 'Student Record deleted' };
    }

    throw { status: 400, message: 'Delete failed' };
  }

  // Update a student
  static async updateStudent(studentId, studentData) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw { status: 404, message: 'Student not found' };
    }

    let { student_code, first_name, last_name, dob, major, admission_year, email } = studentData;

    // Validate and keep current value if invalid
    if (!validationUtils.isValidStudentCode(student_code)) {
      student_code = student.student_code;
    } else {
      student_code = student_code.trim().toUpperCase();
    }

    if (!validationUtils.isValidName(first_name)) {
      first_name = student.first_name;
    } else {
      first_name = capitalize(first_name);
    }

    if (!validationUtils.isValidName(last_name)) {
      last_name = student.last_name;
    } else {
      last_name = capitalize(last_name);
    }

    if (!validationUtils.isValidMySQLDate(dob)) {
      dob = student.dob;
    } else {
      dob = dob.trim();
    }

    if (!major) {
      major = student.major;
    } else {
      major = capitalize(major);
    }

    if (!Number.isInteger(admission_year)) {
      admission_year = student.admission_year;
    }

    if (!validationUtils.isValidEmail(email)) {
      email = student.email;
    } else {
      email = email.trim();
    }

    try {
      await Student.update(studentId, student_code, first_name, last_name, dob, major, admission_year, email);
      return { message: 'Student updated' };

    } catch (error) {
      throw { status: 400, message: 'Student update failed' };
    }
  }
  
  // Get Courses of a Student
  static async getCourses(id, semester = '', page = 1) {
    const student = await Student.findById(id);
    if (!student)
      throw { status: 404, message: 'Student not found' };

    if (!validationUtils.isValidSemesterCode(semester))
      semester = '';

    const courses = await Student.getCourses(id, semester, page);

    if (!courses || courses.length === 0) {
      return { status: 200, message: 'No courses found' };
    }
    return courses;
  }
}

module.exports = StudentService;
