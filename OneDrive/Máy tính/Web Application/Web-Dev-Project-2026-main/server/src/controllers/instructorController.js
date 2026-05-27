const instructorService = require('#Services/instructorService');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getInstructorRecord = async (req, res) => {
  try {
    const instructor = await instructorService.getInstructorById(req.params.id);
    return res.status(200).json(instructor);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const instructors = await instructorService.getAllInstructors(req.query.page);
    return res.status(200).json(instructors);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const searchInstructors = async (req, res) => {
  try {
    const { keyword, page, sort, order } = req.query;
    const results = await instructorService.searchInstructors(keyword, page, sort, order);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteInstructorRecord = async (req, res) => {
  try {
    const result = await instructorService.deleteInstructor(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const createInstructor = async (req, res) => {
  try {
    const result = await instructorService.createInstructor(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const updateInstructor = async (req, res) => {
  try {
    const result = await instructorService.updateInstructor(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { 
  getInstructorRecord, 
  getAllInstructors,
  searchInstructors,
  deleteInstructorRecord,
  createInstructor,
  updateInstructor,
};