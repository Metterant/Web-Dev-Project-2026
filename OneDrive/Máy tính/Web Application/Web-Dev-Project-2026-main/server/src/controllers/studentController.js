const StudentService = require('#Services/studentService');

const getStudentRecord = async (req, res) => {
  try {
    const student = await StudentService.getStudentById(req.params.id);
    return res.status(200).json(student);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await StudentService.getAllStudents();
    return res.status(200).json(students);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const searchStudents = async (req, res) => {
  try {
    const { keyword = '', page = 1, sort = 'student_code', order = 'ASC' } = req.query;
    const results = await StudentService.searchStudents(keyword, page, sort, order);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteStudentRecord = async (req, res) => {
  try {
    const result = await StudentService.deleteStudent(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const result = await StudentService.createStudent(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const result = await StudentService.updateStudent(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { getStudentRecord, getAllStudents, searchStudents, deleteStudentRecord, createStudent, updateStudent };