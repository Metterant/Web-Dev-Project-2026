const db = require('#db/db');

const User = {
    findByUsername: async (username) => {
        // Search student table first
        const [studentRows] = await db.query(
            `SELECT student_id AS user_id, student_code AS username, password_hash, 'student' AS role 
             FROM student WHERE student_code = ?`, [username]);
        if (studentRows[0]) return studentRows[0];

        // Search instructor table
        const [instructorRows] = await db.query(
            `SELECT instructor_id AS user_id, instructor_code AS username, password_hash, 'instructor' AS role 
             FROM instructor WHERE instructor_code = ?`, [username]);
        if (instructorRows[0]) return instructorRows[0];

        // Search admin table last
        const [adminRows] = await db.query(
            `SELECT admin_id AS user_id, username AS username, password_hash, 'admin' AS role 
             FROM system_admin WHERE username = ?`, [username]);
        return adminRows[0];
    }
};

module.exports = User;