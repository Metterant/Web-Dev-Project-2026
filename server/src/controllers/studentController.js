const Student = require('#models/Student');

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

module.exports = { 
  getStudentProfile: getStudentRecord, 
  getAllStudents,
  searchStudents,
  deleteStudentRecord
};