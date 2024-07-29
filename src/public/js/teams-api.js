const pokemones = document.querySelector('#pokemons__Api');
let URL = 'https://pokeapi.co/api/v2/pokemon/';
let allPokemon = [];

// 250 para limitar la cantidad de pokemones
for (let i = 1; i <= 250; i++) {
    fetch(URL + i)
        .then((res) => res.json())
        .then(data => {
            allPokemon.push(data);
            if (allPokemon.length === 250) {
                allPokemon.sort((a, b) => a.id - b.id);
                allPokemon.forEach(poke => showPokemon(poke));
            }
        })
        .catch(error => console.error('Error:', error));
}

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
