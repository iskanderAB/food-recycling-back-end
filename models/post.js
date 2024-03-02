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
}, { timestamps: true });

const Post = mongoose.model('posts', userSchema);

exports.Post = Post;