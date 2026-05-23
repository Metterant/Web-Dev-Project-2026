const db = require('#db/db');
const { getOffset, PAGE_SIZE } = require('#utils/searchUtils');

const Course = {
    getAll: async (page = 1) => {
        const [rows] = await db.query(
            `SELECT course_code, course_name, credits, department_id, instructor_id
             FROM course WHERE status = 'active' ORDER BY department_id ASC LIMIT ? OFFSET ?`,
            [PAGE_SIZE, getOffset(page) || 0]
        );
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query(
            `SELECT course_code, course_name, credits, department_id, instructor_id
             FROM course WHERE course_id = ? AND status = 'active'`,
            [id]
        );
        return rows[0];
    },
    // Expose course_id since this query is only used to find course_id
    findByCode: async (course_code) => {
        const [rows] = await db.query(
            `SELECT course_id, course_code, course_name, credits, department_id, instructor_id
             FROM course WHERE course_code = ? AND status = 'active'`,
            [course_code]
        );
        return rows[0];
    },
    search: async (keyword = '', page = 1, sort = 'course_code', order = 'ASC') => {
        const normalizedKeyword = keyword.trim();
        const allowedColumns = ['course_code', 'course_name', 'credits', 'department_id', 'instructor_id'];
        const safeSort = allowedColumns.includes(sort.trim()) ? sort.trim() : 'course_code';
        const safeOrder = order.toUpperCase().trim() === 'DESC' ? 'DESC' : 'ASC';

        const queryKeyword = `%${normalizedKeyword.toLowerCase()}%`;
        const [rows] = await db.query(
            `SELECT course_code, course_name, credits, department_id, instructor_id
             FROM course
             WHERE status = 'active' AND (course_code LIKE ? OR course_name LIKE ?)
             ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`,
            [queryKeyword, queryKeyword, PAGE_SIZE, getOffset(page) || 0]
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
    create: async (course_code, course_name, credits, department_id = null, instructor_id = null) => {
        const [result] = await db.query(
            `INSERT INTO course (course_code, course_name, credits, department_id, instructor_id)
             VALUES (?, ?, ?, ?, ?)`,
            [course_code, course_name, credits, department_id, instructor_id]
        );
        return result;
    },
    update: async (id, course_code, course_name, credits, department_id = null, instructor_id = null) => {
        const [result] = await db.query(
            `UPDATE course SET
                course_code = ?,
                course_name = ?,
                credits = ?,
                department_id = ?,
                instructor_id = ?
             WHERE course_id = ?`,
            [course_code, course_name, credits, department_id, instructor_id, id]
        );
        return result;
    }
};

module.exports = Course;
