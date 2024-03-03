const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: {
        type: String,
        set: (value) => {
            return bcrypt.hashSync(value, 12)
        }
    },
    FCMToken: String,
    fullname: String,
    phone: String,
    avatar: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    isVendor: {
        type: Boolean,
        required: true,
        default: false,
    },
    phone: String,
    location: String,
}, { timestamps: true });

const User = mongoose.model('users', userSchema);

exports.User = User;