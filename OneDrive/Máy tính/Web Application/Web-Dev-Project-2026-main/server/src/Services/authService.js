const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('#db/db');

const User = require('#models/User');

const login = async (email, password) => {
    console.log('1. Looking up user:', email);  
    const user = await User.findByEmail(email);
    console.log('2. User found:', user);
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign(
        { userId: user.user_id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
    return token;
};

module.exports = { login };