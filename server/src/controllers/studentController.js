const StudentService = require('#services/studentService');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getStudentRecord = async (req, res) => {
  try {
    const studentId = req.params.id; // Get the ID from the URL (e.g., /5)

    const student = await StudentService.getStudentById(studentId);
    return res.status(200).json(student);

  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const students = await StudentService.getAllStudents(page);

    return res.status(200).json(students);

  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const searchStudents = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = req.query.page;
    const sort = req.query.sort;
    const order = req.query.order;

    const results = await StudentService.searchStudents(keyword, page, sort, order);
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const deleteStudentRecord = async (req, res) => {
  try {
    const studentId = req.params.id;

    const result = await StudentService.deleteStudent(studentId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const createStudent = async (req, res) => {
  try {
    const result = await StudentService.createStudent(req.body);
    return res.status(201).json(result);
    
  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const result = await StudentService.updateStudent(studentId, req.body);

    return res.status(200).json(result);

  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(400).json({ message: "Student update failed" })
  }
};

module.exports = {
  getStudentRecord,
  getAllStudents,
  searchStudents,
  deleteStudentRecord,
  createStudent,
  updateStudent
};