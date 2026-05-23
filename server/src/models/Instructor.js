const db = require('#db/db');
const { getOffset, PAGE_SIZE } = require('#utils/searchUtils');

const Instructor = {
    // Get all instructors
    getAll: async (page = 1) => {
        const [rows] = await db.query(
            `SELECT instructor_code, first_name, last_name, email, department_id 
            FROM instructor WHERE status = 'active' ORDER BY instructor_code ASC LIMIT ? OFFSET ?`, [PAGE_SIZE, getOffset(page) || 0]);
        return rows;
    },
    // Find a instructor by their ID
    findById: async (id) => {
        // The ? prevents SQL injection attacks
        const [rows] = await db.query(
            `SELECT instructor_code, first_name, last_name, email, department_id 
            FROM instructor WHERE instructor_id = ? AND status = 'active'`,
            [id]);
        return rows[0]; // Return the first matching user
    },
    // Find a instructor by their code
    findByCode: async (instructor_code) => {
        const [rows] = await db.query(
            `SELECT instructor_code, first_name, last_name, email, department_id 
            FROM instructor WHERE instructor_code = ? AND status = 'active'`,
            [instructor_code]);
        return rows[0];
    },
    // Search instructors by keyword
    search: async (keyword = '', page = 1, sort = 'instructor_code', order = 'ASC') => {
        const normalizedKeyword = keyword.trim();
        
        const allowedColumns = ['instructor_code', 'first_name', 'last_name', 'email'];
        const safeSort = allowedColumns.includes(sort.trim()) ? sort.trim() : 'instructor_code';
        const safeOrder = order.toUpperCase().trim() === 'DESC' ? 'DESC' : 'ASC';

        const queryKeyword = `%${normalizedKeyword.toLowerCase()}%`;
        const [rows] = await db.query(
            `SELECT instructor_code, first_name, last_name, email, department_id
             FROM instructor
             WHERE
                status = 'active' AND
                (CONCAT_WS(' ', first_name, last_name) LIKE ? OR
                email LIKE ? OR
                instructor_code LIKE ?)
             ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`,
            [queryKeyword, queryKeyword, queryKeyword, PAGE_SIZE, getOffset(page) || 0]);
        return rows;
    },
    // Soft delete an instructor by marking status as deleted
    deleteById: async (id) => {
        const [result] = await db.query(
            `UPDATE instructor SET status = 'deleted' WHERE instructor_id = ?`,
            [id]
        );
        return result;
    },
    // Create an instructor
    create: async (instructor_code, first_name, last_name, email, department_id) => {
        const [result] = await db.query(
            `INSERT INTO instructor (instructor_code, first_name, last_name, email, department_id) 
            VALUES (?, ?, ?, ?, ?)`,
            [instructor_code, first_name, last_name, email, department_id]
        );
        return result;
    },
    // Update an instructor
    update: async (id, instructor_code, first_name, last_name, email, department_id) => {
        const [result] = await db.query(
            `UPDATE instructor SET 
                instructor_code = ?,
                first_name = ?,
                last_name = ?,
                email = ?,
                department_id = ?
            WHERE instructor_id = ?`,
            [instructor_code, first_name, last_name, email, department_id, id]
        );
        return result;
    },
};

module.exports = Instructor;