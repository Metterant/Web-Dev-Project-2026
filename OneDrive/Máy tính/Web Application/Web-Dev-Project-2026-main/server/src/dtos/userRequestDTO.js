const validationUtils = require("#utils/validationUtils");

//for user login and registration request validation logic
const UserRequestDTO = {
  validateCreate: (req, res, next) => {
    const { username, password, first_name, last_name } = req.body;
    if (!username || !password || !first_name || !last_name)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    next();
  },

  validateLogin: (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    next();
  }

};


module.exports = UserRequestDTO;