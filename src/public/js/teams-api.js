document.addEventListener('DOMContentLoaded', () => {
    const pokemones = document.querySelector('#pokemons__Api');
    const pokemonFilter = document.querySelector('#pokemonFilter');
    const URL = 'https://pokeapi.co/api/v2/pokemon/';
    let allPokemon = [];
    let excludedPokemons = new Set(); // Track excluded Pokémon

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
        excludedPokemons = new Set(excludedNames); // Update excluded Pokémon
        pokemones.innerHTML = ''; // Clear previous Pokémon
        allPokemon.forEach(poke => {
            if (!excludedPokemons.has(poke.name.toLowerCase())) {
                showPokemon(poke);
            }
        });
        validateTeamInputs(); // Validate team inputs after displaying Pokémon
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

    // Function to validate team inputs against excluded Pokémon
    function validateTeamInputs() {
        const teamInputs = document.querySelectorAll('.team__slot');
        teamInputs.forEach(input => {
            input.addEventListener('input', () => {
                const inputValue = input.value.trim().toLowerCase();
                if (excludedPokemons.has(inputValue)) {
                    input.setCustomValidity('Este pokemon no se puede utilizar.');
                } else {
                    input.setCustomValidity('');
                }
            });
        });
    }

    // Event listener for the filter input
    pokemonFilter.addEventListener('input', () => {
        displayPokemons(); // Redisplay Pokémon with the exclusion filter
    });

    // Initial fetch
    fetchPokemons();
});
