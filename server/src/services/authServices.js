const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('#models/User');

const login = async (username, password) => {
    console.log('1. Looking up user:', username);

    const user = await User.findByUsername(username);

    console.log('2. User found:', user);
    if (!user) throw new Error('Invalid username or password');

    let isMatch = true;
    if (user.password_hash !== 'unset')
        isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid username or password');

    const token = jwt.sign(
        { 
            userId: user.user_id, 
            username: user.username,
            student_id: user.student_id,
            instructor_id: user.instructor_id, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    // Return both token and user info so controller can set cookie and respond with user
    return { token, user: { userId: user.user_id, role: user.role } };
};

const resetPassword = async (username, password) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const user = await User.findByUsername(username);
    if (!user) {
        throw new Error('User not found');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const updatedRows = await User.updatePasswordByUsername(username, passwordHash);

    if (!updatedRows) {
        throw new Error('Password reset failed');
    }

    return { username: user.username };
};

module.exports = { login, resetPassword };