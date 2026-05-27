const db = require('#db/db');
const { getOffset, PAGE_SIZE } = require('#utils/searchUtils');

const allowedSortColumns = ['department_name', 'head_instructor_id', 'course_count'];

const buildDepartmentQuery = (whereClause = '', orderClause = 'ORDER BY d.department_name ASC') => {
    return `SELECT 
                d.department_id,
                d.department_name,
                d.head_instructor_id,
                i.first_name AS ins_fname,
                i.last_name AS ins_lname,
                d.status,
                (
                    SELECT COUNT(*)
                    FROM course c
                    WHERE c.department_id = d.department_id
                        AND c.status = 'active'
                ) AS course_count
            FROM department d
            LEFT JOIN instructor i
                ON d.head_instructor_id = i.instructor_id
            ${whereClause}
            ${orderClause}`;
};

const Department = {
    getAll: async (page = 1) => {
        const [rows] = await db.query(
            `${buildDepartmentQuery("WHERE d.status = 'active'")} LIMIT ? OFFSET ?`,
            [PAGE_SIZE, getOffset(page) || 0]
        );
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query(
            `${buildDepartmentQuery("WHERE d.department_id = ? AND d.status = 'active'")} LIMIT 1`,
            [id]
        );
        return rows[0];
    },
    search: async (keyword = '', page = 1, sort = 'department_name', order = 'ASC') => {
        const normalizedKeyword = keyword.trim();
        const safeSort = allowedSortColumns.includes(sort.trim()) ? sort.trim() : 'department_name';
        const safeOrder = order.toUpperCase().trim() === 'DESC' ? 'DESC' : 'ASC';
        const queryKeyword = `%${normalizedKeyword.toLowerCase()}%`;

        const [rows] = await db.query(
            `${buildDepartmentQuery(
                `WHERE d.status = 'active' AND (
                    d.department_name LIKE ?
                    OR i.first_name LIKE ?
                    OR i.last_name LIKE ?
                    OR CONCAT_WS(' ', i.first_name, i.last_name) LIKE ?
                )`,
                `ORDER BY ${safeSort} ${safeOrder}`
            )} LIMIT ? OFFSET ?`,
            [queryKeyword, queryKeyword, queryKeyword, queryKeyword, PAGE_SIZE, getOffset(page) || 0]
        );
        return rows;
    },
    deleteById: async (id) => {
        const [result] = await db.query(
            `UPDATE department SET status = 'deleted' WHERE department_id = ?`,
            [id]
        );
        return result;
    },
    create: async (department_name, head_instructor_id = null) => {
        const [result] = await db.query(
            `INSERT INTO department (department_name, head_instructor_id)
             VALUES (?, ?)`,
            [department_name, head_instructor_id]
        );
        return result;
    },
    update: async (id, department_name, head_instructor_id = null) => {
        const [result] = await db.query(
            `UPDATE department SET
                department_name = ?,
                head_instructor_id = ?
             WHERE department_id = ?`,
            [department_name, head_instructor_id, id]
        );
        return result;
    },
};

module.exports = Department;