const mongoose = require('mongoose');

let friendsSchema = new mongoose.Schema({
    nameUser: { type: String, required: true },
}, { versionKey: false })

let friendsModel = new mongoose.model('Friends', friendsSchema)

module.exports = friendsModel;