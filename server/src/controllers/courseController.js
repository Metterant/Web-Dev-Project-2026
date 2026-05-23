const Course = require('#models/Course');
const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getCourseRecord = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.getAll();
    if (!courses || courses.length === 0) return res.status(404).json({ message: 'Courses not found' });
    return res.status(200).json(courses);
  } catch (error) {
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
    const results = await Course.search(keyword, page, sort, order);
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const deleteCourseRecord = async (req, res) => {
  try {
    const courseId = req.params.id;
    const result = await Course.deleteById(courseId);
    if (!result) return res.status(404).json({ message: 'Course not found' });
    if (result.affectedRows === 1) return res.status(200).json({ message: 'Course deleted' });
    return res.status(400).json({ message: 'Delete failed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const createCourse = async (req, res) => {
  try {
    let { course_code, course_name, credits, department_id, instructor_id } = req.body;

    course_code = course_code ? course_code.trim().toUpperCase() : '';
    course_name = capitalize(course_name);
    credits = Number(credits);
    department_id = department_id !== undefined && department_id !== null ? Number(department_id) : null;
    instructor_id = instructor_id !== undefined && instructor_id !== null ? Number(instructor_id) : null;

    if (!validationUtils.isValidCourseCode(course_code))
      return res.status(406).json({ message: 'Invalid course code' });

    if (!course_name) return res.status(406).json({ message: 'Empty course name' });

    if (!Number.isInteger(credits) || credits <= 0)
      return res.status(406).json({ message: 'Invalid credits' });

    const exists = await Course.findByCode(course_code);
    if (exists) return res.status(409).json({ message: `Course code '${course_code}' already exists` });

    await Course.create(course_code, course_name, credits, department_id, instructor_id);
    return res.status(201).json({ message: 'Course created' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Duplicate course code' });
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const current = await Course.findById(courseId);
    if (!current) return res.status(404).json({ message: 'Course not found' });

    let { course_code, course_name, credits, department_id, instructor_id } = req.body;

    if (!validationUtils.isValidCourseCode(course_code)) course_code = current.course_code;
    else course_code = course_code.trim().toUpperCase();

    if (!course_name) course_name = current.course_name; else course_name = capitalize(course_name);

    credits = Number(credits);
    if (!Number.isInteger(credits) || credits <= 0) credits = current.credits;

    department_id = department_id !== undefined && department_id !== null ? Number(department_id) : current.department_id;
    instructor_id = instructor_id !== undefined && instructor_id !== null ? Number(instructor_id) : current.instructor_id;

    await Course.update(courseId, course_code, course_name, credits, department_id, instructor_id);
    return res.status(200).json({ message: 'Course updated' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Course update failed' });
  }
};

module.exports = {
  getCourseRecord,
  getAllCourses,
  searchCourses,
  deleteCourseRecord,
  createCourse,
  updateCourse
};
