const Instructor = require('#models/Instructor');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getInstructorRecord = async (req, res) => {
  try {
    const InstructorId = req.params.id; // Get the ID from the URL (e.g., /5)
    
    // Call the Model to get the data
    const Instructor = await Instructor.findById(InstructorId);

    if (!Instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Send the data back as JSON
    res.status(200).json(Instructor);
    
  } catch (error) {
    console.error(error);
    res.status(500).json(serverMessages[500]);
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const Instructors = await Instructor.getAll();

    if (!Instructors || Instructors.length === 0) {
      return res.status(404).json({ message: 'Instructors not found' });
    }

    // Send the data back as JSON
    res.status(200).json(Instructors);
    
  } catch (error) {
    console.error(error);
    res.status(500).json(serverMessages[500]);
  }
};

const searchInstructors = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = req.query.page;
    const sort = req.query.sort;
    const order = req.query.order;

    const results = await Instructor.search(keyword, page, sort, order);
    return res.status(200).json(results);
  
  } catch (error) {
    console.error(error);
      res.status(500).json(serverMessages[500]);
  }
};

const deleteInstructorRecord = async (req, res) => {
  try {
    const InstructorId = req.params.id;
    
    const result = await Instructor.deleteById(InstructorId);

    if (!result) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (result.affectedRows == 1) 
      res.status(200).json({ message: 'Instructor Record deleted' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json(serverMessages[500]);
  }
};

module.exports = { 
  getInstructorRecord: getInstructorRecord, 
  getAllInstructors,
  searchInstructors,
  deleteInstructorRecord
};