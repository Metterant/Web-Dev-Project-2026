const validationUtils = require("#utils/validationUtils");

//for user login and registration request validation logic
const UserRequestDTO = {
  validateCreate: (req, res, next) => {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    next();
  },

  validateLogin: (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });
    if(!validationUtils.isValidEmail(email)){
      return res.status(400).json({ message: 'Invalid email format' });
    }
    next();
  }

};


module.exports = UserRequestDTO;