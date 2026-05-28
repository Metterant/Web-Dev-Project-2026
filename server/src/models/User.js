const db = require('#db/db');

const User = {
    findByUsername: async (username) => {
        const [users] = await db.query(`SELECT user_id, username, password_hash, student_id, instructor_id, role FROM user WHERE username = ?`, [username]);

        return users[0];
    },

    updatePasswordByUsername: async (username, passwordHash) => {
        const [result] = await db.query(
            `UPDATE user SET password_hash = ? WHERE username = ?`,
            [passwordHash, username]
        );

        return result.affectedRows;
    }
}

module.exports = User;