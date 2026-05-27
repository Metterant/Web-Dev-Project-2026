const authService = require('../services/authServices');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        const token = result.token;
        const user = result.user;

        // Set httpOnly cookie; in production set secure=true
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        });

        // Return minimal user info. Do NOT return token when using cookie-only auth flows.
        return res.status(200).json({ user });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        } 
        else if (error.message === 'Invalid username or password') {
            return res.status(401).json({ message: error.message });
        }
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};  

exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
};