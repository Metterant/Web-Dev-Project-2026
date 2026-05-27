const authService = require('../services/authServices');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);

        res.cookie('token', token, { httpOnly: true,
                                     secure: false, 
                                     maxAge: 3600000}); // 1 hour


        return res.status(200).json({ token });
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