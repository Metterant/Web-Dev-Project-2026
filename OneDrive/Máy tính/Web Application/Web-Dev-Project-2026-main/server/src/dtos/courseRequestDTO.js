const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

const validateCreate = (req, res, next) => {
  let { course_code, course_name, credits } = req.body;

  //check if body is empty
  if (!course_code || !course_name || credits === undefined)
    return res.status(400).json({ message: 'All fields are required' });

  // sanitize
  req.body.course_code = course_code ? course_code.trim().toUpperCase() : '';
  req.body.course_name = capitalize(course_name);
  req.body.credits = Number(credits);

  // validate
  if (!validationUtils.isValidCourseCode(req.body.course_code))
    return res.status(406).json({ message: 'Invalid course code' });
  if (!Number.isInteger(req.body.credits) || req.body.credits <= 0)
    return res.status(406).json({ message: 'Invalid credits' });

  next();
};

const validateUpdate = (req, res, next) => {
  let { course_code, course_name, credits } = req.body;

  //check if body is empty
  if (!course_code && !course_name && !credits)
    return res.status(400).json({ message: 'At least one field is required for update' });

  // sanitize
  if (course_code !== undefined) req.body.course_code = course_code.trim().toUpperCase();
  if (course_name !== undefined) req.body.course_name = capitalize(course_name);
  if (credits !== undefined) req.body.credits = Number(credits);

  next();
};  

module.exports = { validateCreate, validateUpdate };