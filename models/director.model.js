const mongoose = require('mongoose')

const directorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    birthYear: {
        type: Number,
    },
    password:{
    type: String,
    require:true,
    select: false
    },
    email: {
        type: String,
        required: true,
        unique: true, 
      },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film', 
    }]
})

module.exports = mongoose.model('Director', directorSchema)
