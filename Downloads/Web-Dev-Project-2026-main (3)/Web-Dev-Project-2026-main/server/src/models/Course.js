const db = require('#db/db');
const { getOffset, PAGE_SIZE } = require('#utils/searchUtils');

const Course = {
    getAll: async (page = 1) => {
        const [rows] = await db.query(
            `SELECT course_id, course_code, course_name, credits, department_name, instructor_code, ins_fname, ins_lname, start_period, end_period
             FROM course_view WHERE status = 'active' ORDER BY department_id ASC LIMIT ? OFFSET ?`,
            [PAGE_SIZE, getOffset(page) || 0]
        );
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query(
            `SELECT course_id, course_code, course_name, credits, department_name, instructor_code, ins_fname, ins_lname, start_period, end_period
             FROM course_view WHERE course_id = ? AND status = 'active'`,
            [id]
        );
        return rows[0];
    },
    findByCode: async (course_code) => {
        const [rows] = await db.query(
            `SELECT course_id, course_code, course_name, credits, department_id
             FROM course WHERE course_code = ? AND status = 'active'`,
            [course_code]
        );
        return rows[0];
    },
    search: async (keyword = '', page = 1, sort = 'course_code', order = 'ASC') => {
        const normalizedKeyword = keyword.trim();
        const allowedColumns = ['course_code', 'course_name', 'credits', 'department_id', 'day_of_week', 'start_period', 'end_period'];
        const safeSort = allowedColumns.includes(sort.trim()) ? sort.trim() : 'course_code';
        const safeOrder = order.toUpperCase().trim() === 'DESC' ? 'DESC' : 'ASC';

        const queryKeyword = `%${normalizedKeyword.toLowerCase()}%`;
        const [rows] = await db.query(
            `SELECT course_id, course_code, course_name, credits, department_name, instructor_code, ins_fname, ins_lname, start_period, end_period, enrollment_count
             FROM course_view
             WHERE status = 'active' AND (
                course_code LIKE ? 
                OR course_name LIKE ?
                OR department_name LIKE ?
                OR instructor_code LIKE ?
                OR ins_fname = ?
                OR ins_lname = ?
             )
             ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`,
            [queryKeyword, queryKeyword, queryKeyword, queryKeyword, queryKeyword, queryKeyword, PAGE_SIZE, getOffset(page) || 0]
        );
        return rows;
    },
    deleteById: async (id) => {
        const [result] = await db.query(
            `UPDATE course SET status = 'deleted' WHERE course_id = ?`,
            [id]
        );
        return result;
    },
    create: async (course_code, course_name, credits, department_id = null) => {
        const [result] = await db.query(
            `INSERT INTO course (course_code, course_name, credits, department_id)
             VALUES (?, ?, ?, ?)`,
            [course_code, course_name, credits, department_id]
        );
        return result;
    },
    update: async (id, course_code, course_name, credits, department_id = null) => {
        const [result] = await db.query(
            `UPDATE course SET
                course_code = ?,
                course_name = ?,
                credits = ?,
                department_id = ?
             WHERE course_id = ?`,
            [course_code, course_name, credits, department_id, id]
        );
        return result;
    },
    getStudents: async (course_id, semester, page = 1) => {
        const [students] = await db.query(
            `SELECT s.student_id, s.student_code, s.first_name, s.last_name
             FROM enrollment e
             JOIN student s ON s.student_id = e.student_id
             WHERE e.course_id = ?
                AND e.semester = ?
                AND e.status = 'active'
                AND s.status = 'active'
             ORDER BY s.student_code
             LIMIT ? OFFSET ?`,
            [course_id, semester, PAGE_SIZE, getOffset(page) || 0]
        );
        return students;
    },
    // Get instructors for a course
    getInstructorsForCourse: async (course_id) => {
        const [instructors] = await db.query(
            `SELECT ci.course_instructor_id, ci.instructor_id, i.instructor_code, 
                    i.first_name, i.last_name, ci.day_of_week, ci.start_period, ci.end_period, ci.status
             FROM course_instructor ci
             JOIN instructor i ON ci.instructor_id = i.instructor_id
             WHERE ci.course_id = ? AND ci.status = 'active'
             ORDER BY i.instructor_code`,
            [course_id]
        );
        return instructors;
    },
    // Assign an instructor to a course
    addInstructor: async (course_id, instructor_id, day_of_week, start_period, end_period) => {
        const [result] = await db.query(
            `INSERT INTO course_instructor (course_id, instructor_id, day_of_week, start_period, end_period)
             VALUES (?, ?, ?, ?, ?)`,
            [course_id, instructor_id, day_of_week, start_period, end_period]
        );
        return result;
    },
    // Remove an instructor from a course
    removeInstructor: async (course_instructor_id) => {
        const [result] = await db.query(
            `UPDATE course_instructor SET status = 'deleted' WHERE course_instructor_id = ?`,
            [course_instructor_id]
        );
        return result;
    },
};

module.exports = Course;
