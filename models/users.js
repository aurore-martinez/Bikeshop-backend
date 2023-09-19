const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    email : String,
    firstname: String,
    password : String,
    token: String,
    canPanier: Boolean,
})


const User = mongoose.model('users',userSchema);



module.exports = User