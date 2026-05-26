const Instructor = require('#models/Instructor');
const validationUtils = require('#utils/validationUtils');
const { capitalize } = require('#utils/stringUtils');

const serverMessages = {
  500: { message: 'Server Error' }
};

const getInstructorRecord = async (req, res) => {
  try {
    const InstructorId = req.params.id; // Get the ID from the URL (e.g., /5)
    
    // Call the Model to get the data
    const Instructor = await Instructor.findById(InstructorId);

    if (!Instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Send the data back as JSON
    return res.status(200).json(Instructor);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const Instructors = await Instructor.getAll();

    if (!Instructors || Instructors.length === 0) {
      return res.status(404).json({ message: 'Instructors not found' });
    }

    // Send the data back as JSON
    return res.status(200).json(Instructors);
    
  } catch (error) {
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

    const results = await Instructor.search(keyword, page, sort, order);
    return res.status(200).json(results);
  
  } catch (error) {
    console.error(error);
      return res.status(500).json(serverMessages[500]);
  }
};

const deleteInstructorRecord = async (req, res) => {
  try {
    const InstructorId = req.params.id;
    
    const result = await Instructor.deleteById(InstructorId);

    if (!result) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (result.affectedRows == 1) 
      return res.status(200).json({ message: 'Instructor Record deleted' });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json(serverMessages[500]);
  }
};

const createInstructor = async (req, res) => {
  try {
    let { instructor_code, first_name, last_name, email, department_id } = req.body;

    instructor_code = instructor_code.trim().toUpperCase();
    first_name = capitalize(first_name);
    last_name = capitalize(last_name);
    email = email.trim();
    department_id = Number(department_id);

    /* Validate fields in backend */

    if (!validationUtils.isValidInstructorCode(instructor_code))
      return res.status(400).json({
        message: `Invalid instructor Code`
      });

    if (!validationUtils.isValidName(first_name))
      return res.status(400).json({
        message: `Invalid first name`
      });

    if (!validationUtils.isValidName(last_name))
      return res.status(400).json({
        message: `Invalid last name`
      });

    if (!validationUtils.isValidEmail(email))
      return res.status(400).json({
        message: `Invalid email`
      });
    
    // TODO: Addtional department_id check needed
    if (!Number.isInteger(department_id)) {
      return res.status(400).json({
        message: `Invalid department id`
      });
    }

    // Check first for better UX
    const exists = await Instructor.findByCode(instructor_code);
    if (exists) {
      return res.status(409).json({
        message: `Instructor code '${instructor_code}' already exists`
      });
    }

    // Proceed with insert (database constraint is final safety)
    await Instructor.create(instructor_code, first_name, last_name, email, department_id);

    return res.status(201).json({ message: 'Instructor created' });

  } catch (error) {
    console.error(error);
    // Catches database constraint violations as fallback
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Duplicate instructor code' });
    }
    res.status(500).json(serverMessages[500]);
  }
};

const updateInstructor = async (req, res) => {
  try {
    const instructorId = req.params.id;

    const instructor = await Instructor.findById(instructorId);
    
    if (!instructor)
      return res.status(404).json({ message: "Instructor not found" });

    let { instructor_code, first_name, last_name, email, department_id } = req.body;

    if (!validationUtils.isValidInstructorCode(instructor_code))
      instructor_code = instructor.instructor_code;

    if (!validationUtils.isValidName(first_name))
      first_name = instructor.first_name;

    if (!validationUtils.isValidName(last_name))
      last_name = instructor.last_name

    if (!validationUtils.isValidEmail(email))
      email = instructor.email;

    if (!Number.isInteger(department_id)) {
      // TODO: Additional department_id check needed in the future
      department_id = instructor.department_id;
    }
    
    await Instructor.update(instructorId, instructor_code, first_name, last_name, email, department_id);

    return res.status(200).json({ message: "Instructor updated"});

  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Instructor update failed" })
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