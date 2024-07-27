const mongoose = require('mongoose');

let passwordListsSchema = new mongoose.Schema({
    userPassword: { type: String, required: true },
    newPassword: { type: String, required: true, unique: true},
    confirmPassword: { type: String, required: true },
}, { versionKey: false })

let passwordListsModel = new mongoose.model('PasswordLists', passwordListsSchema)

module.exports = passwordListsModel;