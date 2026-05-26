const db = require('#db/db');

const User = {
    findByEmail: async (email) => {
        // Search student table first
        const [studentRows] = await db.query(
            `SELECT student_id AS user_id, email, password_hash, 'student' AS role 
             FROM student WHERE email = ?`, [email]);
        if (studentRows[0]) return studentRows[0];

        // Search instructor table
        const [instructorRows] = await db.query(
            `SELECT instructor_id AS user_id, email, password_hash, 'instructor' AS role 
             FROM instructor WHERE email = ?`, [email]);
        if (instructorRows[0]) return instructorRows[0];

        // Search admin table last
        const [adminRows] = await db.query(
            `SELECT admin_id AS user_id, email, password_hash, 'admin' AS role 
             FROM system_admin WHERE email = ?`, [email]);
        return adminRows[0];
    }
};

module.exports = User;