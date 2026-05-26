const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

const validateCreate = (req, res, next) => {
  let { first_name, last_name, email } = req.body;
    //check if body is empty
    if (!first_name || !last_name || !email)
      return res.status(400).json({ message: 'All fields are required' });
    // sanitize
    req.body.first_name = capitalize(first_name);
    req.body.last_name = capitalize(last_name); 
    req.body.email = email.trim();
    // validate
    if (!validationUtils.isValidName(req.body.first_name)) {
      return res.status(400).json({ message: 'Invalid first name' });
    }
    if (!validationUtils.isValidName(req.body.last_name)) {
      return res.status(400).json({ message: 'Invalid last name' });
    }
    if (!validationUtils.isValidEmail(req.body.email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    next();
  };

  const validateUpdate = (req, res, next) => {
    let { first_name, last_name, email } = req.body;    
    //check if body is empty
    if (!first_name && !last_name && !email)
      return res.status(400).json({ message: 'At least one field is required for update' });
    // sanitize
    if (first_name !== undefined) req.body.first_name = capitalize(first_name);
    if (last_name !== undefined) req.body.last_name = capitalize(last_name);
    if (email !== undefined) req.body.email = email.trim();
    // validate
    if (first_name !== undefined && !validationUtils.isValidName(req.body.first_name)) {
        return res.status(400).json({ message: 'Invalid first name' });
    }
    if (last_name !== undefined && !validationUtils.isValidName(req.body.last_name)) {
        return res.status(400).json({ message: 'Invalid last name' });
    }
    if (email !== undefined && !validationUtils.isValidEmail(req.body.email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    next();
  };

  module.exports = { validateCreate, validateUpdate };