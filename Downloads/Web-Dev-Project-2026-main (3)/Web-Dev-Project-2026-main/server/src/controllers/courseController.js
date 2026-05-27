const CourseService = require('#services/courseService');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getCourseRecord = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseService.getCourseById(courseId);
    return res.status(200).json(course);

  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const getAllCourses = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const courses = await CourseService.getAllCourses(page);
    return res.status(200).json(courses);

  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const searchCourses = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = req.query.page;
    const sort = req.query.sort;
    const order = req.query.order;

    const results = await CourseService.searchCourses(keyword, page, sort, order);
    return res.status(200).json(results);

  } catch (error) {
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const deleteCourseRecord = async (req, res) => {
  try {
    const courseId = req.params.id;

    const result = await CourseService.deleteCourse(courseId);
    return res.status(200).json(result);

  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const createCourse = async (req, res) => {
  try {
    const result = await CourseService.createCourse(req.body);
    return res.status(201).json(result);

  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const result = await CourseService.updateCourse(courseId, req.body);

    return res.status(200).json(result);
  } catch (error) {
    if (error.status) 
      return res.status(error.status).json({ message: error.message });

    console.error(error);
    return res.status(400).json({ message: 'Course update failed' });
  }
};

const getStudents = async (req, res) => {
  try {
    const courseId = req.params.id;
    const semester = req.query.semester;
    const page = req.query.page;

    const students = await CourseService.getStudents(courseId, semester, page);
      
    return res.status(200).json(students);

  } catch (error) {
      if (error.status) 
        return res.status(error.status).json({ message: error.message });

    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

module.exports = {
  getCourseRecord,
  getAllCourses,
  searchCourses,
  deleteCourseRecord,
  createCourse,
  updateCourse,
  getStudents
};
