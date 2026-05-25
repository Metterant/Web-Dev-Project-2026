const InstructorService = require('#services/instructorService');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getInstructorRecord = async (req, res) => {
  try {
    const InstructorId = req.params.id; // Get the ID from the URL (e.g., /5)
    
    const instructor = await InstructorService.getInstructorById(InstructorId);
    return res.status(200).json(instructor);
    
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const instructors = await InstructorService.getAllInstructors(page);
    return res.status(200).json(instructors);
    
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const searchInstructors = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = req.query.page;
    const sort = req.query.sort;
    const order = req.query.order;

    const results = await InstructorService.searchInstructors(keyword, page, sort, order);
    return res.status(200).json(results);
  
  } catch (error) {
    console.error(error);
      return res.status(500).json(serverMessages[500]);
  }
};

const deleteInstructorRecord = async (req, res) => {
  try {
    const InstructorId = req.params.id;
    
    const result = await InstructorService.deleteInstructor(InstructorId);
    return res.status(200).json(result);
    
  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const createInstructor = async (req, res) => {
  try {
    const result = await InstructorService.createInstructor(req.body);
    return res.status(201).json(result);

  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    res.status(500).json(serverMessages[500]);
  }
};

const updateInstructor = async (req, res) => {
  try {
    const instructorId = req.params.id;

    const result = await InstructorService.updateInstructor(instructorId, req.body);
    return res.status(200).json(result);
    
  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(400).json({ message: "Instructor update failed" })
  }
};

const getCourses = async (req, res) => {
  try {
    const instructorId = req.params.id;
    const page = req.query.page;

    const courses = await InstructorService.getCourses(instructorId, page);
    return res.status(200).json(courses);

  } catch (error) {
    if (error.status)
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};


module.exports = { 
  getInstructorRecord, 
  getAllInstructors,
  searchInstructors,
  deleteInstructorRecord,
  createInstructor,
  updateInstructor,
  getCourses
};