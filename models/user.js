const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/Proyecto'

mongoose.connect(DB_URI, {})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));

let userSchema = new mongoose.Schema({
    userImg: { type: String },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    secondLastName: { type: String, required: true },
    nameUser: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    id: { type: Number, required: true }
}, { versionKey: false })

let userModel = new mongoose.model('User', userSchema)

module.exports = userModel;