const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

const validateCreate = (req, res, next) => {
  let { instructor_code, first_name, last_name, email, department_id } = req.body;

  //check if body is empty
  if (!instructor_code || !first_name || !last_name || !email || department_id === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // sanitize
  req.body.instructor_code = instructor_code.trim().toUpperCase();
  req.body.first_name = capitalize(first_name);
  req.body.last_name = capitalize(last_name);
  req.body.email = email.trim().toLowerCase();
  req.body.department_id = Number(department_id);

  //validate
  if (!validationUtils.isValidInstructorCode(req.body.instructor_code)) {
    return res.status(400).json({ message: "Invalid instructor code" });
  }
  if (!validationUtils.isValidName(req.body.first_name)) {
    return res.status(400).json({ message: "Invalid first name" });
  }
  if (!validationUtils.isValidName(req.body.last_name)) {
    return res.status(400).json({ message: "Invalid last name" });
  }
  if (!validationUtils.isValidEmail(req.body.email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (!Number.isInteger(req.body.department_id)) {
    return res.status(400).json({ message: "Invalid department ID" });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  let { instructor_code, first_name, last_name, email, department_id } = req.body;

  //sanitize
  if (instructor_code) req.body.instructor_code = instructor_code.trim().toUpperCase();
  if (first_name) req.body.first_name = capitalize(first_name);
  if (last_name) req.body.last_name = capitalize(last_name);
  if (email) req.body.email = email.trim().toLowerCase();
  if (department_id !== undefined) req.body.department_id = Number(department_id);

  if (instructor_code && !validationUtils.isValidInstructorCode(instructor_code)) {
    return res.status(400).json({ message: "Invalid instructor code" });
  }

  if (first_name && !validationUtils.isValidName(first_name)) {
    return res.status(400).json({ message: "Invalid first name" });
  }

  if (last_name && !validationUtils.isValidName(last_name)) {
    return res.status(400).json({ message: "Invalid last name" });
  }

  if (email && !validationUtils.isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (department_id && !Number.isInteger(department_id)) {
    return res.status(400).json({ message: "Invalid department ID" });
  }

  next();
};

module.exports = { validateCreate, validateUpdate };