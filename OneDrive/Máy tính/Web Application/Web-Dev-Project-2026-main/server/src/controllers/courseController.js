const courseService = require('#Services/courseService');

const getCourseRecord = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    return res.status(200).json(course);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const searchCourses = async (req, res) => {
  try {
    const { keyword = '', page = 1, sort = 'course_code', order = 'ASC' } = req.query;
    const results = await courseService.searchCourses(keyword, page, sort, order);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteCourseRecord = async (req, res) => {
  try {
    const result = await courseService.deleteCourse(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const result = await courseService.createCourse(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const result = await courseService.updateCourse(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { getCourseRecord, getAllCourses, searchCourses, deleteCourseRecord, createCourse, updateCourse };