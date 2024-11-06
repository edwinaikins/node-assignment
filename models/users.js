const mongoose = require("mongoose");

const Users = mongoose.Schema({
    username: String,
    password: String
})

const User = mongoose.model("Users", Users);

module.exports = User