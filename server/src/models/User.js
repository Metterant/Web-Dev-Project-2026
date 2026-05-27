const db = require('#db/db');

const User = {
    findByUsername: async (username) => {
        const [users] = await db.query(`SELECT user_id, username, password_hash, role FROM user WHERE username = ?`, [username]);

        return users[0];
    }
}

module.exports = User;