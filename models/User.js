const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passportLocalMongoose = require('passport-local-mongoose');
const { max } = require('moment');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    savedRoutes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        default: []
    }],
});

// Hash the password before saving the user
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

var options = {
    errorMessages: {
        MissingPasswordError: 'no_password_given',
        AttemptTooSoonError: 'account_is_currently_locked_try_again_later',
        TooManyAttemptsError: 'account_locked_due_to_too_many_failed_login_attempts',
        NoSaltValueStoredError: 'authentication_not_possible_No_salt_value_stored',
        IncorrectPasswordError: 'password_or_username_are_incorrect',
        IncorrectUsernameError: 'password_or_username_are_incorrect',
        MissingUsernameError: 'no_username_was_given',
        UserExistsError: 'User with the given email already exists'
    },
    usernameField: 'email'
};

userSchema.plugin(passportLocalMongoose, options);

const User = mongoose.model('User', userSchema);

module.exports = User;