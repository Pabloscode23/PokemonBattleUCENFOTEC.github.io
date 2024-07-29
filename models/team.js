const mongoose = require('mongoose');

let teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true }
}, { versionKey: false });

let teamModel = new mongoose.model('Team', teamSchema)
module.exports = teamModel;