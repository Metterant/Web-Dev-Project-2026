const db = require('#db/db');
const { getOffset, PAGE_SIZE } = require('#utils/searchUtils');

const Student = {
    // Get all students
    getAll: async (page) => {
        const [rows] = await db.query(
            `SELECT student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email 
            FROM student WHERE status = 'active' ORDER BY student_id ASC LIMIT ? OFFSET ?`, [PAGE_SIZE, getOffset(page) || 0]);
        return rows;
    },
    // Find a student by their ID
    findById: async (id) => {
        // The ? prevents SQL injection attacks
        const [rows] = await db.query(
            `SELECT student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email 
            FROM student WHERE student_id = ? AND status = 'active'`, 
            [id]);
        return rows[0]; // Return the first matching user
    },
    // Find a student by their code
    findByCode: async (student_code) => {
        const [rows] = await db.query(
            `SELECT student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email 
            FROM student WHERE student_code = ? AND status = 'active'`, 
            [student_code]);
        return rows[0];
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
                status = 'active' AND
                CONCAT_WS(' ', first_name, last_name) LIKE ? OR
                email LIKE ? OR
                student_code LIKE ? OR
                major LIKE ?
             ORDER BY student_id ASC LIMIT ? OFFSET ?`,
            [queryKeyword, queryKeyword, queryKeyword, queryKeyword, PAGE_SIZE, getOffset(page) || 0]);
        return rows;
    },
        // Soft delete a student by marking status as deleted
    deleteById: async (id) => {
        const [result] = await db.query(
            `UPDATE student SET status = 'deleted' WHERE student_id = ?`,
            [id]
        );
        return result;
    }
};

module.exports = Student;