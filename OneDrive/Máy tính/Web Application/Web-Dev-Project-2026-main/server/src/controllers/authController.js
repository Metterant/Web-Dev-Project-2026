const authService = require('../Services/authService');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);

        //send token as cookie instead of in response body
        res.cookie('token', token, { httpOnly: true,    //js can't access
                                     secure: false,     //set to true in production with HTTPS
                                     maxAge: 3600000 }); //1 hour expiration (milliseconds)
                           
        return res.status(200).json({ message: 'Login successful' });
    }catch (error) {
        if(error.message === 'Invalid username or password') {
            return res.status(401).json({message: error.message});
        }
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};  

exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
};