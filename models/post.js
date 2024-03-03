const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    location: {
        latitude: Number,
        longitude: Number,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

const Post = mongoose.model('posts', userSchema);

exports.Post = Post;