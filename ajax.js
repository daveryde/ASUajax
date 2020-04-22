// Global variable
var button, jokeCategory, description, content;

function getElements() {
  button = document.querySelector('#button');
  jokeCategory = document.querySelector('#joke-category');
  description = document.querySelector('.description');
  delivery = document.querySelector('.delivery');
}

function handleClick() {
  // Clear previous joke
  clearDOM();

  // Execute getJoke
  getJoke();
}

function clearDOM() {
  if (jokeCategory) {
    jokeCategory.innerHTML = '';
  }
  if (description) {
    description.innerHTML = '';
  }
  if (delivery) {
    delivery.innerHTML = '';
  }
}

function init() {
  // Grab DOM elements on page
  getElements();

  // Listen for button click
  button.addEventListener('click', handleClick, false);
}

function getJoke() {
  // API Optional Configuration
  var baseURL = 'https://sv443.net/jokeapi/v2';
  var categories = ['Programming'];
  var params = ['blacklistFlags=nsfw,religious,racist,sexist', 'idRange=0-100'];

  var xhr = new XMLHttpRequest();

  // Reference: https://sv443.net/jokeapi/v2
  // URL to api with parameters
  xhr.open(
    'GET',
    baseURL + '/joke/' + categories.join(',') + '?' + params.join('&')
  );

  // Example Payload
  // {
  //   "formatVersion": 2,
  //     "category": "Miscellaneous",
  //       "type": "single",
  //         "joke": "A horse walks into a bar...",
  //           "flags": {
  //     "nsfw": true,
  //       "religious": false,
  //         "political": true,
  //           "racist": false,
  //             "sexist": false
  //   }
  // }

  xhr.onreadystatechange = function () {
    // readyState 4 means request has finished + we only want to parse the joke if the request was successful (status code lower than 300)
    if (xhr.readyState == 4 && xhr.status < 300) {
      // Transform json data to string
      var randomJoke = JSON.parse(xhr.responseText);

      // If type == "single", the joke only has the "joke" property
      if (randomJoke.type == 'single') {
        // Append joke type to DOM
        jokeCategory.innerHTML += randomJoke.category;

        // Append joke text to DOM
        description.innerHTML += randomJoke.joke;
      } else {
        // Append the joke to DOM elements
        jokeCategory.innerHTML += randomJoke.category;
        description.innerHTML += randomJoke.setup;
        delivery.innerHTML += randomJoke.delivery;
      }
    }
    // readyState 4 but the network response is not in the 200 range
    else if (xhr.readyState == 4) {
      delivery.innerHTML +=
        '<p>Error while requesting joke.<br>Status code: ' +
        xhr.status +
        '<br>Server response: ' +
        xhr.responseText;
    }
  };

  xhr.send();
}

window.addEventListener('load', init, false);
