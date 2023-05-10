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

// Create Human Object
function Human(name, height, weight, diet) {
  this.species = name;
  this.height = height;
  this.weight = weight;
  this.diet = diet;
}
const human = new Human();

// Use IIFE to get human data from form
const inName = document.getElementById('name');
const inFeet = document.getElementById('feet');
const inInches = document.getElementById('inches');
const inWeight = document.getElementById('weight');
const inDiet = document.getElementById('diet');

const getHumanData = (() => {
  function getData() {
    human.species = inName.value;
    human.height = inFeet.value + inInches.value * 5;
    human.weight = inWeight.value;
    human.diet = inDiet.value;
  }
  return {
    human: getData,
  }
})();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches. 
Dino.prototype.compareWeight = (fact) => {
  if (dino.weight > human.weight) {
    dino.fact = `${dino.species} is ${dino.weight - human.weight} lbs heavier than ${human.species}`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} is ${human.weight - dino.weight} lbs lighter than ${human.species}`;
    return dino.fact;
  }
}

// Create Dino Compare Method 2
Dino.prototype.compareHeight = (fact) => {
  if (dino.weight > human.weight) {
    dino.fact = `${dino.species} is ${dino.weight - human.weight} inches taller than ${human.species}`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} is ${human.weight - dino.weight} inches smaller than ${human.species}`;
    return dino.fact;
  }
}

// Create Dino Compare Method 3
Dino.prototype.compareDiet = (fact) => {
  if (human.diet === dino.diet) {
    dino.fact = `${dino.species} is ${dino.diet} like ${human.species}`;
    return dino.fact;
  } else {
    dino.fact = `${dino.species} is ${dino.diet} but ${human.species} is ${human.diet} `;
    return dino.fact;
  }
}

// Get data Dino Json
const getDinoData = async () => {
  const dinoJson = await fetch("./dino.json");
  const data = await dinoJson.json();
  generateTile(data.Dinos);
};

// Generate Tiles for each Dino in Array
const generateTile = (dinoArr) => {
  let dinoData = [];
  const sifterArr = [1, 1, 1, 0, 0, 0, 0];
  // Shuffle array
  shuffle(sifterArr);
  let pigeonIndex = dinoArr.findIndex((dino) => dino.species === 'Pigeon');
  sifterArr.splice(pigeonIndex, 0, 0);
  dinoArr.forEach((item, i) => {
    dino.species = item.species
    dino.height = item.height
    dino.weight = item.weight
    dino.diet = item.diet
    if (sifterArr[i]) {
      let random = Math.floor(Math.random() * 3) + 1;
      if (item instanceof Human) {
        random = '';
      }
      switch (random) {
        case 1:
          dino.compareHeight(item.fact);
          break;
        case 2:
          dino.compareWeight(item.fact);
          break;
        case 3:
          dino.compareDiet(item.fact);
          break;
        default:
          break;
      }
    } else {
      dino.fact = item.fact;
    }

    dinoData.push(JSON.parse(JSON.stringify(dino)));
  });
  dinoData.splice(4, 0, human);
  dinoData.forEach((item) => {
    addTilesToDOM(item);
  });
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Add tiles to DOM
const grid = document.getElementById('grid');
const form = document.getElementById('dino-compare');
const buttonCompare = document.getElementById('btn');
const addTilesToDOM = (dino) => {
  const div = document.createElement("div");
  div.className = "grid-item";
  const h3Element = document.createElement("h3");
  const imgElement = document.createElement("img");
  const pElement = document.createElement("p");

  if (dino instanceof Human) {
    imgElement.src = "./images/human.png";
  } else {
    dino.species = dino.species.toUpperCase();
    imgElement.src = `./images/${(dino.species)}.png`;
  }
  h3Element.textContent = dino.species;
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