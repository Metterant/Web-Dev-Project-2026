const Student = require('#models/Student');
const { capitalize } = require('#utils/stringUtils');

class StudentService {
  static async getAllStudents(page = 1) {
    const students = await Student.getAll(page);
    if (!students || students.length === 0) {
      throw { status: 404, message: 'Students not found' };
    }
    return students;
  }

  static async getStudentById(studentId) {
    const student = await Student.findById(studentId);
    if (!student) throw { status: 404, message: 'Student not found' };
    return student;
  }

  static async searchStudents(keyword, page = 1, sort = 'student_code', order = 'ASC') {
    return await Student.search(keyword, page, sort, order);
  }

  static async createStudent(studentData) {
    let { student_code, first_name, last_name, dob, major, admission_year, email } = studentData;

    // DTO already validated names/email, just transform remaining fields
    student_code = student_code.trim().toUpperCase();
    dob = dob.trim();
    major = capitalize(major);
    admission_year = Number(admission_year);

    const exists = await Student.findByCode(student_code);
    if (exists) throw { status: 409, message: `Student code '${student_code}' already exists` };

    try {
      await Student.create(student_code, first_name, last_name, dob, major, admission_year, email);
      return { message: 'Student created' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw { status: 409, message: 'Duplicate student code' };
      throw error;
    }
  }

  static async deleteStudent(studentId) {
    const result = await Student.deleteById(studentId);
    if (!result || result.affectedRows === 0) throw { status: 404, message: 'Student not found' };
    return { message: 'Student Record deleted' };
  }

  static async updateStudent(studentId, studentData) {
    const current = await Student.findById(studentId);
    if (!current) throw { status: 404, message: 'Student not found' };

    let { student_code, first_name, last_name, dob, major, admission_year, email } = studentData;

    // Fallback to current values if not provided
    student_code = student_code ? student_code.trim().toUpperCase() : current.student_code;
    first_name = first_name || current.first_name;
    last_name = last_name || current.last_name;
    dob = dob ? dob.trim() : current.dob;
    major = major ? capitalize(major) : current.major;
    admission_year = admission_year ? Number(admission_year) : current.admission_year;
    email = email || current.email;

    try {
      await Student.update(studentId, student_code, first_name, last_name, dob, major, admission_year, email);
      return { message: 'Student updated' };
    } catch (error) {
      throw { status: 400, message: 'Student update failed' };
    }
  }
}

module.exports = StudentService;