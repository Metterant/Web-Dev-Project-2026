const db = require('#db/db');
const { getOffset, PAGE_SIZE } = require('#utils/searchUtils');

const Student = {
    // Get all students
    getAll: async (page = 1) => {
        const [rows] = await db.query(
            `SELECT student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email 
            FROM student WHERE status = 'active' ORDER BY student_code ASC LIMIT ? OFFSET ?`, [PAGE_SIZE, getOffset(page) || 0]);
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
            `SELECT student_id, student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email 
            FROM student WHERE student_code = ? AND status = 'active'`,
            [student_code]);
        return rows[0];
    },
    // Search students by keyword
    search: async (keyword = '', page = 1, sort = 'student_code', order = 'ASC') => {
        const normalizedKeyword = keyword.trim();

        const allowedColumns = ['student_code', 'first_name', 'last_name', 'dob', 'major', 'admission_year', 'email'];
        const safeSort = allowedColumns.includes(sort.trim()) ? sort.trim() : 'student_code';
        const safeOrder = order.toUpperCase().trim() === 'DESC' ? 'DESC' : 'ASC';

        const queryKeyword = `%${normalizedKeyword.toLowerCase()}%`;
        const [rows] = await db.query(
            `SELECT student_code, first_name, last_name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, major, admission_year, email
             FROM student
             WHERE
                status = 'active' AND
                (CONCAT_WS(' ', first_name, last_name) LIKE ? OR
                email LIKE ? OR
                student_code LIKE ? OR
                major LIKE ?)
             ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`,
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
    },
    // Create a student
    create: async (student_code, first_name, last_name, dob, major, admission_year = new Date().getFullYear(), email) => {
        const [result] = await db.query(
            `INSERT INTO student (student_code, first_name, last_name, dob, major, admission_year, email) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [student_code, first_name, last_name, dob, major, admission_year, email]
        );
        return result;
    },
    // Update a student
    update: async (id, student_code, first_name, last_name, dob, major, admission_year = new Date().getFullYear(), email) => {
        const [result] = await db.query(
            `UPDATE student SET 
                student_code = ?,
                first_name = ?,
                last_name = ?,
                dob = ?,
                major = ?,
                admission_year = ?,
                email = ?
            WHERE student_id = ?`,
            [student_code, first_name, last_name, dob, major, admission_year, email, id]
        );
        return result;
    },
    // Get student courses
    getCourses: async (student_id, semester, page = 1) => {
        const [courses] = await db.query(`
            SELECT c.course_id, c.course_code, c.course_name, c.credits, COUNT(ci.instructor_id) as instructor_count
            FROM enrollment e
            JOIN course c ON c.course_id = e.course_id
            LEFT JOIN course_instructor ci ON c.course_id = ci.course_id AND ci.status = 'active'
            WHERE e.student_id = ?
                AND e.semester LIKE ?
                AND e.status = 'active'
                AND c.status = 'active'
            GROUP BY c.course_id, c.course_code, c.course_name, c.credits
            ORDER BY c.course_code
            LIMIT ? OFFSET ?;
            `,
            [student_id, `%${semester}%`, PAGE_SIZE, getOffset(page) || 0]
        );
        return courses;
    },
    getSchedule: async (student_id, semester = '', page = 1) => {
        const [rows] = await db.query(
             `SELECT course_code, course_name, department_name, instructor_code, ins_fname, ins_lname, start_period, end_period, semester, grade, enrollment_status, course_status
             FROM student_schedule_view
             WHERE student_id = ?
               AND semester LIKE ?
               AND enrollment_status = 'active'
               AND course_status = 'active'
             ORDER BY semester, course_code
             LIMIT ? OFFSET ?`,
            [student_id, `%${semester}%`, PAGE_SIZE, getOffset(page) || 0]
        );
        return rows;
    }
};

module.exports = Student;