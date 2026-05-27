const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('#models/User');

const login = async (username, password) => {
    console.log('1. Looking up user:', username);  
    const user = await User.findByUsername(username);
    console.log('2. User found:', user);
    if (!user) throw new Error('Invalid username or password');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid username or password');

    const token = jwt.sign(
        { userId: user.user_id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
    return token;
};

module.exports = { login };