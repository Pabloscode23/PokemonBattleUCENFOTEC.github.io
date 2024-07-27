const mongoose = require('mongoose');

let loginSchema = new mongoose.Schema({
    nameUser: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
}, { versionKey: false })

let loginModel = new mongoose.model('login', loginSchema)

module.exports = loginModel;
