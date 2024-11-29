const User = require('../../../models/User'); // Import the User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../../../utils/asyncHandler'); // Adjust the path as needed
const passport = require('passport');

// Register a new user
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'name, email, and password are required.' });
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Invalid email format.' });
    }

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ status: 'error', message: 'User already registered.' });
    }

    const saltRounds = 10; // Adjust as needed
    // user = new User({ name, email, password: await bcrypt.hash(password, saltRounds), role: 'user' });
    User.register({ name, email, role: 'user' }, password, async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
        }
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const httpOnly = process.env.HTTP_ONLY === 'true';

        res.cookie('authToken', token, {
            httpOnly: httpOnly,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        return res.send({ success: true, message: 'User registered successfully.' });
    });
});



// Login a user
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        return res.status(400).send('Invalid email format.');
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Invalid email or password.');
    }

    passport.authenticate('local', function (err, user, info) {
        if (info != undefined && (info.name == 'IncorrectPasswordError' || info.name == 'IncorrectUsernameError')) {
            if (!user) { return res.status(401).send('user or password is incorrect'); }
        }
        if (err) {
            console.log(info.name, 'name')
            return console.log(err, 'err')
        }
        if (!user) { return res.status(401).send('user not found'); }

        req.logIn(user, async function (err) {
            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const httpOnly = process.env.HTTP_ONLY === 'true';
            res.cookie('authToken', token, {
                httpOnly: httpOnly,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000 // 1 hour
            }).send({
                message: 'Logged in successfully.',
                user: { name: user.name, email: user.email, role: user.role }
            });
        });


    })(req, res, next);
});

// Logout a user
exports.logout = (req, res) => {
    res.clearCookie('authToken').send('Logged out successfully.');
};

// Get user profile
exports.profile = (req, res) => {
    const { savedRoutes, ...userWithoutSavedRoutes } = req.user.toObject();
    res.send(userWithoutSavedRoutes);
};

// Update name or password
exports.update = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email) {
        if (!emailPattern.test(email)) {
            return res.status(400).send('Invalid email format.');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already registered.');
        }
    }

    const user = await User.findById(req.user._id);

    if (email) {
        user.email = email;
    }

    if (name) {
        user.name = name;
    }

    if (password) {
        user.password = password;
    }

    await user.save();
    res.send('User updated successfully.');
});