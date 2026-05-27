const db = require('#db/db');

const User = {
    findByUsername: async (username) => {
        const [users] = await db.query(`SELECT user_id, username, password_hash, student_id, instructor_id, role FROM user WHERE username = ?`, [username]);

        return users[0];
    }
}

module.exports = User;