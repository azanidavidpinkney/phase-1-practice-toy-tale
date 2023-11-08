let addToy = false;
let toyList = []; // establishes STATE for our primary data set

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const toysAPI = "http://localhost:3000/toys"; // defines the path to the API we're accessing
const toyCollection = document.getElementById('toy-collection'); // defines the location in the HTML/DOM we want to manipulate
const newToyForm = document.getElementById("add-toy-form"); // Defining variable needed to manipulate new toy form

// defines function to pull all necessary toy data from API and establish STATE
function getToys() {
  fetch(toysAPI)// GETS toy data in raw HTTP format
  .then(response => response.json()) // converts raw HTTP format toy data into JSON format
  .then(toys => { // tells us WHAT TO DO with the JSON data we've retrieved
    toyList = toys; // aligns our data with STATE (defined in line 2)
    renderToys(toys); // defines what to do with the returned data, also now defined in STATE
  });
}

// defines function to establish space for rendering all retrieved data, and rendering each toy.
function renderToys(toys) {
  toyCollection.innerHTML = ``; // clears our HTML space each time the function reloads;
  toys.forEach(renderToy); // calls function to RENDER each of our toys (defined below)
};

// defines function to render EACH toy of our data to our page
function renderToy(toy) {
  const toyCard = document.createElement('div'); // identifies the element we want to CREATE
  toyCard.classList.add('card'); // executes the requested modification (adding a class to the element)
  toyCollection.appendChild(toyCard) // adds the empty div (card) with classname "card" to parent toy-collection div
  
  // Method to insert interpolated HTML content directly into the div based on toy data
  toyCard.innerHTML = `
  <h2>"${toy.name}"</h2>
  <img src="${toy.image}" class="toy-avatar" />
  <p>${toy.likes} Likes</p>
  <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Defining variable needed to manipulate like button
  const likeButton = document.getElementById(`${toy.id}`)

  // Adding event listener to like button
  likeButton.addEventListener('click', () => addLike(toy))
}

getToys(); // runs the getToys function to display data required for the "initial state" of our webpage to take effect

// Adding global event listener to form
newToyForm.addEventListener('submit', postNewToy);

function postNewToy(e) {
  e.preventDefault(); // stops event from causing a full page reload, which is the default result
  const newToyData = {
    name: e.target.name.value, 
    image: e.target.image.value,
    likes: 0
  }

    fetch(toysAPI, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      method: 'POST',
      body: JSON.stringify(newToyData)
    })
    .then(response => response.json())
    .then(renderToy);

    e.target.reset(); // this method clears the form once data has been submitted and the function has been run
}

// Defines function that will add the like to the existing count and render on page
function addLike(toy) {
  const newLikes = toy.likes + 1;
  fetch(`${toysAPI}/${toy.id}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    method: "PATCH",
    body: JSON.stringify({likes : newLikes})
  })
  .then(response => response.json())
  .then(() => {
    toy.likes = newLikes;
    renderToys(toyList);
    });
};

