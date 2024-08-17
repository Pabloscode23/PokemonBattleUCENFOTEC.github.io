const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    gamesLost: { type: Number, default: 0 },
    winPercentage: { type: Number, default: 0 },
    lossPercentage: { type: Number, default: 0 }
});

const Ranking = mongoose.model('Ranking', rankingSchema);

module.exports = Ranking;
