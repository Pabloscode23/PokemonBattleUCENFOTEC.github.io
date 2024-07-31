const mongoose = require('mongoose');

let teamSchema = new mongoose.Schema({
    pokemonOne: { type: String, required: true },
    pokemonTwo: { type: String, required: true },
    pokemonThree: { type: String, required: true },
    pokemonFour: { type: String, required: true },
    pokemonFive: { type: String, required: true },
    pokemonSix: { type: String, required: true },
    teamName: { type: String, required: true },
    createdBy: { type: String }
}, { versionKey: false });

let teamModel = new mongoose.model('Team', teamSchema)
module.exports = teamModel;