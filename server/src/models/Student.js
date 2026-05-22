const db = require('#db/db');
const { getOffset, PAGE_SIZE } = require('#utils/searchUtils');

const Student = {
    // Find a student by their ID
    findById: async (id) => {
        // The ? prevents SQL injection attacks
        const [rows] = await db.query(
            `SELECT student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email 
            FROM student WHERE student_id = ?`, 
            [id]);
        return rows[0]; // Return the first matching user
    },
    // Get all students
    getAll: async (page) => {
        const [rows] = await db.query(
            `SELECT student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email 
            FROM student ORDER BY student_id ASC LIMIT ? OFFSET ?`, [PAGE_SIZE, getOffset(page) || 0]);
        return rows;
    },
    // Search students by keyword
    search: async (keyword, page) => {
        const normalizedKeyword = keyword.trim();
        if (!normalizedKeyword) return [];

        const queryKeyword = `%${normalizedKeyword.toLowerCase()}%`;
        const [rows] = await db.query(
            `SELECT student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email
             FROM student
             WHERE
                CONCAT_WS(' ', first_name, last_name) LIKE ? OR
                email LIKE ? OR
                student_code LIKE ? OR
                major LIKE ?
             ORDER BY student_id ASC LIMIT ? OFFSET ?`,
            [queryKeyword, queryKeyword, queryKeyword, queryKeyword, PAGE_SIZE, getOffset(page) || 0]);
        return rows;
    },
};

module.exports = Student;