const Student = require('#models/Student');
const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getStudentRecord = async (req, res) => {
  try {
    const studentId = req.params.id; // Get the ID from the URL (e.g., /5)

    // Call the Model to get the data
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Send the data back as JSON
    res.status(200).json(student);

  } catch (error) {
    console.error(error);
    res.status(500).json(serverMessages[500]);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.getAll();

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Students not found' });
    }

    // Send the data back as JSON
    res.status(200).json(students);

  } catch (error) {
    console.error(error);
    res.status(500).json(serverMessages[500]);
  }
};

const searchStudents = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = req.query.page;
    const sort = req.query.sort;
    const order = req.query.order;

    const results = await Student.search(keyword, page, sort, order);
    return res.status(200).json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json(serverMessages[500]);
  }
};

const deleteStudentRecord = async (req, res) => {
  try {
    const studentId = req.params.id;

    const result = await Student.deleteById(studentId);

    if (!result) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (result.affectedRows == 1)
      res.status(200).json({ message: 'Student Record deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json(serverMessages[500]);
  }
};

const createStudent = async (req, res) => {
  try {
    let { student_code, first_name, last_name, dob, major, admission_year, email } = req.body;

    student_code = student_code.trim().toUpperCase();
    first_name = capitalize(first_name);
    last_name = capitalize(last_name);
    dob = dob.trim();
    major = capitalize(major);
    admission_year = Number(admission_year);
    email = email.trim();

    /* Validate fields in backend */

    if (!validationUtils.isValidStudentCode(student_code))
      return res.status(400).json({
        message: `Invalid Student Code`
      });

    if (!validationUtils.isValidName(first_name))
      return res.status(400).json({
        message: `Invalid first name`
      });

    if (!validationUtils.isValidName(last_name))
      return res.status(400).json({
        message: `Invalid last name`
      });

    if (!validationUtils.isValidMySQLDate(dob))
      return res.status(400).json({
        message: `Invalid Date of Birth`
      });

    if (!major)
      return res.status(400).json({
        message: `Empty major`
      });

    if (!validationUtils.isValidEmail(email))
      return res.status(400).json({
        message: `Invalid email`
      });

    // Check first for better UX
    const exists = await Student.findByCode(student_code);
    if (exists) {
      return res.status(409).json({
        message: `Student code '${student_code}' already exists`
      });
    }

    // Proceed with insert (database constraint is final safety)
    await Student.create(student_code, first_name, last_name, dob, major, admission_year, email);
    res.status(201).json({ message: 'Student created' });
  } catch (error) {
    // Catches database constraint violations as fallback
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Duplicate student code' });
    }
    res.status(500).json(serverMessages[500]);
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    let { student_code, first_name, last_name, dob, major, admission_year, email } = req.body;

    if (!validationUtils.isValidStudentCode(student_code))
      student_code = student.student_code;

    if (!validationUtils.isValidName(first_name))
      first_name = student.first_name;

    if (!validationUtils.isValidName(last_name))
      last_name = student.last_name

    if (!validationUtils.isValidMySQLDate(dob))
      dob = student.dob;

    if (!major)
      major = student.major;

    if (!Number.isInteger(admission_year))
      admission_year = student.admission_year;

    if (!validationUtils.isValidEmail(email))
      email = student.email;

    await Student.update(studentId, student_code, first_name, last_name, dob, major, admission_year, email);

    return res.status(200).json({ message: "Student updated"});

  } catch (error) {
    return res.status(400).json({ message: "Student update failed" })
  }
}

module.exports = {
  getStudentRecord,
  getAllStudents,
  searchStudents,
  deleteStudentRecord,
  createStudent,
  updateStudent
};