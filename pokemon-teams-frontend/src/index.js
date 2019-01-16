const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {
  displayTrainerCards()

})


// GET DOM ELEMENTS
function getMain() {
  return document.querySelector('main')
}

function getTrainerUl(trainerId) {
  return document.querySelector(`[data-id='${trainerId}'] ul`)
}

function getPokemonLi(pokemonId) {
  return document.querySelector(`[data-pokemon-id='${pokemonId}']`).parentElement
}

function countPokemonLis(trainerId) {
  return getTrainerUl(trainerId).children.length
}


// FETCH REQUESTS
function getAllTrainers() {
  return fetch(TRAINERS_URL)
}

function getPokemon(trainerId) {
  const data = {trainer_id: trainerId}
  return fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(data)
  })
}

function deletePokemon(pokemonId) {
  return fetch(`${POKEMONS_URL}/${pokemonId}`, {
    method: "DELETE"
  })
}

// HTML CREATION FUNCTIONS

function renderTrainerCard(trainerObj) {
  const trainerCardDiv = document.createElement('div')
  trainerCardDiv.classList.add('card')
  trainerCardDiv.dataset.id = trainerObj.id

  const trainerP = document.createElement('p')
  trainerP.innerText = trainerObj.name

  const addPokemonButton = document.createElement('button')
  addPokemonButton.dataset.trainerId = trainerObj.id
  addPokemonButton.innerText = 'Add Pokemon'
  addPokemonButton.addEventListener('click', () => handleAddPokemon(trainerObj))

  const trainerUl = document.createElement('ul')

  const pokemons = trainerObj.pokemons
  pokemons.forEach(pokemonObj => {
    const li = renderPokemonForTrainerCard(pokemonObj)
    trainerUl.appendChild(li)
  })

  trainerCardDiv.appendChild(trainerP)
  trainerCardDiv.appendChild(addPokemonButton)
  trainerCardDiv.appendChild(trainerUl)

  getMain().appendChild(trainerCardDiv)

}

function renderPokemonForTrainerCard(pokemonObj) {
  const pokemonLi = document.createElement('li')
  pokemonLi.innerText = `${pokemonObj.nickname} (${pokemonObj.species})`

  const pokemonButton = document.createElement('button')
  pokemonButton.classList.add('release')
  pokemonButton.dataset.pokemonId = pokemonObj.id
  pokemonButton.innerText = 'Release'
  pokemonButton.addEventListener('click', () =>  handleReleasePokemon(pokemonObj))

  pokemonLi.appendChild(pokemonButton)
  return pokemonLi
}

function displayTrainerCards() {
  getAllTrainers()
  .then(res => res.json())
  .then(trainers =>
    {
      trainers.forEach(trainerObj => renderTrainerCard(trainerObj))
  })
}

function addNewPokemonToTrainerCard(pokemonObj) {
  const trainerId = pokemonObj.trainer_id
  getTrainerUl(trainerId).appendChild(renderPokemonForTrainerCard(pokemonObj))
}


// Event Handlers
function handleAddPokemon(trainerObj) {
  if (countPokemonLis(trainerObj.id) < 6) {
    
    getPokemon(trainerObj.id)
      .then(res => res.json())
      .then(pokemonObj => addNewPokemonToTrainerCard(pokemonObj))
  }
}

function handleReleasePokemon(pokemonObj) {
  deletePokemon(pokemonObj.id)
    .then(res => res.json())
    .then((pokemon) => {
      getPokemonLi(pokemon.id).remove()
    })
}
