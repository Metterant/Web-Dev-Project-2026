const authService = require('../Services/authService');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
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