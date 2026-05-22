const Student = require('#models/Student');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getStudentProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get the ID from the URL (e.g., /5)
    
    // Call the Model to get the data
    const student = await Student.findById(userId);

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

      if (!keyword) {
        return res.status(400).json({ message: 'Missing search keyword' });
      }

      const results = await Student.search(keyword, page);
      return res.status(200).json(results);

  } catch (error) {
    console.error(error);
      res.status(500).json(serverMessages[500]);
  }
};

module.exports = { 
  getStudentProfile, 
  getAllStudents,
  searchStudents
};