const db = require('#db/db');

const Student = {
    // Find a student by their ID
    findById: async (id) => {
        // The ? prevents SQL injection attacks
        const [rows] = await db.query('SELECT student_code, first_name, last_name, email FROM student WHERE student_id = ?', [id]);
        return rows[0]; // Return the first matching user
    },
    // Get all students
    getAll: async () => {
        const [rows] = await db.query('SELECT student_code, first_name, last_name, email FROM student');
        return rows;
    }
};

module.exports = Student;