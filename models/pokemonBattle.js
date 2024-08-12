const mongoose = require('mongoose');

const pokemonBattleSchema = new mongoose.Schema({
    pokemonName: { type: String, required: true, unique: true },
    roundsUsed: { type: Number, default: 0 }, // Count of rounds this Pokémon was used
    defeatedBy: [{ type: String }], // Array of Pokémon names that defeated this Pokémon
    defeatedPokemon: [{ type: String }] // Array of Pokémon names that this Pokémon has defeated
});

const PokemonBattle = mongoose.model('PokemonBattle', pokemonBattleSchema);

module.exports = PokemonBattle;
