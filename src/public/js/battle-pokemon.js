let listaPokemon, pokemon1, pokemon2;
function capitalizar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
async function fetchListaPokemon() {
  try {
    const respuesta = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
    );
    //trabajando aca
    const resultado = await respuesta.json();
    listaPokemon = resultado.results;

    const select1 = document.getElementById("pokemon1");
    const select2 = document.getElementById("pokemon2");

    select1.innerHTML = listaPokemon.map(function (pokemon) {
      return `<option value='${pokemon.url
        }'>${capitalizar(pokemon.name)}</option>`;
    });

    select2.innerHTML = listaPokemon.map((pokemon) => {
      return `<option value='${pokemon.url}'>${capitalizar(
        pokemon.name
      )}</option>`;
    });
  } catch (error) {
    console.error(error);
  }
}
async function fetchPokemon(url) {
  try {
    const respuesta = await fetch(url);
    const datos = respuesta.json();
    return datos;
  } catch (error) {
    console.error(error);
  }
}
///SELECCION
const cargarPokemones = async () => {
  const select1 = document.getElementById("pokemon1");
  const select2 = document.getElementById("pokemon2");

  const pokemonSeleccionado1 = select1.options[select1.selectedIndex].value;
  const pokemonSeleccionado2 = select2.options[select2.selectedIndex].value;

  pokemon1 = await fetchPokemon(pokemonSeleccionado1);
  pokemon1.hp = pokemon1.stats[0].base_stat;
  pokemon2 = await fetchPokemon(pokemonSeleccionado2);
  pokemon2.hp = pokemon2.stats[0].base_stat;

  const imagenPokemon1 = document.getElementById("imagen-pokemon1");
  imagenPokemon1.src = pokemon1.sprites.back_default;
  const imagenPokemon2 = document.getElementById("imagen-pokemon2");
  imagenPokemon2.src = pokemon2.sprites.front_default;


  const nombrePokemon1 = document.getElementById("nombre-pokemon1");
  nombrePokemon1.innerHTML = capitalizar(pokemon1.name);
  const nombrePokemon2 = document.getElementById("nombre-pokemon2");
  nombrePokemon2.innerHTML = capitalizar(pokemon2.name);



  const hpPokemon1 = document.getElementById("vida-pokemon1");
  hpPokemon1.value = pokemon1.hp;
  hpPokemon1.max = pokemon1.stats[0].base_stat;
  const hpLabelPokemon1 = document.getElementById("label-hp1");
  hpLabelPokemon1.innerHTML = `${pokemon1.hp}/${pokemon1.stats[0].base_stat}`;

  const hpPokemon2 = document.getElementById("vida-pokemon2");
  hpPokemon2.value = pokemon2.hp;
  hpPokemon2.max = pokemon2.stats[0].base_stat;
  const hpLabelPokemon2 = document.getElementById("label-hp2");
  hpLabelPokemon2.innerHTML = `${pokemon2.hp}/${pokemon2.stats[0].base_stat}`;



  const ataquesContenedor1 = document.getElementById("ataques-1");
  ataquesContenedor1.style.position = 'absolute' /*asi se mueven los botones*/
  ataquesContenedor1.style.display = 'flex'
  ataquesContenedor1.className = 'ataquesContenedor1'
  const ataquesContenedor2 = document.getElementById("ataques-2");
  ataquesContenedor2.style.display = 'flex'
  ataquesContenedor2.className = 'ataquesContenedor2'



  await generarAtaques(pokemon1, ataquesContenedor1);
  await generarAtaques(pokemon2, ataquesContenedor2);
};
const generarAtaques = async (pokemon, contenedor) => {
  const movesPokemon = [];
  for (let i = 0; i < 4; i++) {
    const indice = Math.floor(Math.random() * pokemon.moves.length);
    movesPokemon.push(pokemon.moves[indice]);
  }

  const promesas = movesPokemon.map((ataque) => {
    return fetch(ataque.move.url);
  });

  const respuestas = await Promise.all(promesas);

  const ataques = await Promise.all(
    respuestas.map(function (respuesta) {
      return respuesta.json();
    })
  );

  let receptorDano;

  if (pokemon.name === pokemon1.name) {
    receptorDano = "pokemon2";
  } else {
    receptorDano = "pokemon1";
  }

  contenedor.innerHTML = ataques.map(
    (ataque) =>
      `<button class="boton-ataque" onclick="aplicarDano(${ataque.power
      }, ${receptorDano})">${capitalizar(ataque.name)}</button>`
  );
};

function aplicarDano(dano, pokemon) {
  pokemon.hp = pokemon.hp - dano;
  if (pokemon.hp < 0) {
    pokemon.hp = 0;
  }

  if (pokemon.name === pokemon1.name) {
    const imagenPokemon1 = document.getElementById("imagen-pokemon1");
    imagenPokemon1.classList.toggle("dano");
    setTimeout(() => {
      imagenPokemon1.classList.toggle("dano");
      if (pokemon.hp === 0) {
        imagenPokemon1.classList.toggle("muerto");
      }
    }, 501);
    const hpPokemon1 = document.getElementById("vida-pokemon1");
    hpPokemon1.value = pokemon1.hp;
    const hpLabelPokemon1 = document.getElementById("label-hp1");
    hpLabelPokemon1.innerHTML = `${pokemon1.hp}/${pokemon1.stats[0].base_stat}`;
  } else {
    const imagenPokemon2 = document.getElementById("imagen-pokemon2");
    imagenPokemon2.classList.toggle("dano");
    setTimeout(() => {
      imagenPokemon2.classList.toggle("dano");
      if (pokemon.hp === 0) {
        imagenPokemon1.classList.toggle("muerto");
      }
    }, 501);
    const hpPokemon2 = document.getElementById("vida-pokemon2");
    hpPokemon2.value = pokemon2.hp;
    const hpLabelPokemon2 = document.getElementById("label-hp2");
    hpLabelPokemon2.innerHTML = `${pokemon2.hp}/${pokemon2.stats[0].base_stat}`;
  }
}
const funcionFlecha = () => { };

window.onload = function () {
  fetchListaPokemon();
};