// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}

// Create Dino Objects
const dino = new Dino();

// Get data Dino Json
const getDinoData = () =>
  fetch('./dino.json')
    .then(res => res.json())
    .then(data => generateTile(data.Dinos));

// Create Human Constructor
function Human(name, height, weight, diet) {
  this.species = name;
  this.height = height;
  this.weight = weight;
  this.diet = diet;
}

// Create Human Object
const human = new Human();

// Use IIFE to get human data from form
const inName = document.getElementById('name');
const inFeet = document.getElementById('feet');
const inInches = document.getElementById('inches');
const inWeight = document.getElementById('weight');
const inDiet = document.getElementById('diet');

// Get Human data from DOM
const getHumanData = (() => {
  function setHumanData() {
    human.species = inName.value;
    // Convert feet to inches
    human.height = inFeet.value * 12 + parseInt(inInches.value);
    human.weight = inWeight.value;
    human.diet = inDiet.value;
  }
  return {
    human: setHumanData,
  }
})();

// Create Dino Compare Weight
// NOTE: Weight in JSON file is in lbs, height in inches. 
Dino.prototype.compareWeight = () => {
  if (dino.weight > human.weight) {
    dino.fact = `${dino.species} living ${dino.when} at ${dino.where} is ${dino.weight - human.weight} lbs heavier than ${human.species}`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} living ${dino.when} at ${dino.where} is ${human.weight - dino.weight} lbs lighter than ${human.species}`;
    return dino.fact;
  }
}

// Create Dino Compare Height
Dino.prototype.compareHeight = () => {
  if (dino.height > human.height) {
    dino.fact = `${dino.species} living ${dino.when} at ${dino.where} is ${dino.height - human.height} inches taller than ${human.species}`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} living ${dino.when} at ${dino.where} is ${human.height - dino.height} inches smaller than ${human.species}`;
    return dino.fact;
  }
}

// Create Dino Compare Diet
Dino.prototype.compareDiet = () => {
  if (human.diet === dino.diet) {
    dino.fact = `${dino.species} living ${dino.when} at ${dino.where} is ${dino.diet} like ${human.species}`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} living ${dino.when} at ${dino.where} is ${dino.diet} but ${human.species} is ${human.diet}. They are different`;
    return dino.fact;
  }
}

// Generate Tiles for each Dino in Array
const generateTile = (dinos) => {
  let dinoDatas = [];
  const indexDinos = [1, 0, 1, 0, 1, 0, 1];

  // Shuffle array
  shuffle(indexDinos);

  let birdIndex = dinos.findIndex((dino) => dino.fact === 'All birds are living dinosaurs.');
  indexDinos.splice(birdIndex, 0, 0);
  dinos.forEach((item, i) => {
    dino.species = item.species
    dino.height = item.height
    dino.weight = item.weight
    dino.when = item.when
    dino.where = item.where
    dino.diet = item.diet
    if (indexDinos[i]) {
      let random = Math.floor(Math.random() * 3);
      switch (random) {
        case 0:
          dino.compareWeight();
          break;
        case 1:
          dino.compareHeight();
          break;
        case 2:
          dino.compareDiet();
          break;
        default:
          break;
      }
    } else {
      dino.fact = item.fact;
    }

    // Insert data dino to dinoDatas
    dinoDatas.push(JSON.parse(JSON.stringify(dino)));
  });
  dinoDatas.splice(((dinoDatas.length / 2)), 0, human);
  dinoDatas.forEach((item) => {
    addTilesToDOM(item);
  });
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i - 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Get DOM element
const grid = document.getElementById('grid');
const form = document.getElementById('dino-compare');
const buttonCompare = document.getElementById('btn');

// Add tiles to DOM
const addTilesToDOM = (dino) => {
  const div = document.createElement("div");
  div.className = "grid-item";
  const h3Element = document.createElement("h3");
  const imgElement = document.createElement("img");
  const pElement = document.createElement("p");

  if (dino instanceof Human) {
    imgElement.src = "./images/human.png";
  } else {
    dino.species = dino.species.toLowerCase();
    imgElement.src = `./images/${(dino.species)}.png`;
  }
  h3Element.textContent = dino.species.toUpperCase();
  pElement.textContent = dino.fact;

  div.appendChild(h3Element);
  div.appendChild(imgElement);
  div.appendChild(pElement);

  grid.appendChild(div);
}

// Remove form from screen
function removeForm() {
  form.style.display = "none";
}

// On button click, prepare and display infographic
function handleCompare() {
  getDinoData();
  getHumanData.human();
  removeForm();
}

// Handle Add event for button
buttonCompare.addEventListener('click', handleCompare);