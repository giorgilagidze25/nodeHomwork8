const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
    },
    year: {
        type: Number,
    },
    desc: {
        type: String,
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director'
    },
});

module.exports = mongoose.model('Film', filmSchema);
