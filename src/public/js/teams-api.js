document.addEventListener('DOMContentLoaded', () => {
    const pokemones = document.querySelector('#pokemons__Api');
    const pokemonFilter = document.querySelector('#pokemonFilter');
    const URL = 'https://pokeapi.co/api/v2/pokemon/';
    let allPokemon = [];

    // Function to fetch Pokémon data
    function fetchPokemons() {
        allPokemon = [];  // Reset the array before fetching new data
        for (let i = 1; i <= 250; i++) {
            fetch(URL + i)
                .then(res => res.json())
                .then(data => {
                    allPokemon.push(data);
                    if (allPokemon.length === 250) {
                        allPokemon.sort((a, b) => a.id - b.id);
                        displayPokemons();
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }

    // Function to display Pokémon, excluding those in the exclude list
    function displayPokemons() {
        const excludedNames = pokemonFilter.value.trim().toLowerCase().split(/\s*,\s*/);
        pokemones.innerHTML = ''; // Clear previous Pokémon
        allPokemon.forEach(poke => {
            if (!excludedNames.includes(poke.name.toLowerCase())) {
                showPokemon(poke);
            }
        });
    }

    // Function to show a single Pokémon
    function showPokemon(poke) {
        const div = document.createElement('div');
        div.classList.add('pokemons__pokemon');
        div.innerHTML = `
            <p class="pokemon__id">#${poke.id}</p>
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
            <span>${poke.name}</span>
        `;
        pokemones.append(div);
    }

    // Event listener for the filter input
    pokemonFilter.addEventListener('input', () => {
        displayPokemons(); // Redisplay Pokémon with the exclusion filter
    });

    // Initial fetch
    fetchPokemons();
});