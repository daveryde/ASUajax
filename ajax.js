// // Global variable
// var button, jokeCategory, description, content;

// function getElements() {
//   button = document.querySelector('#button');
//   jokeCategory = document.querySelector('#joke-category');
//   description = document.querySelector('.description');
//   delivery = document.querySelector('.delivery');
// }

// function handleClick() {
//   // Clear previous joke
//   clearDOM();

//   // Execute getJoke
//   getJoke();
// }

// function clearDOM() {
//   if (jokeCategory) {
//     jokeCategory.innerHTML = '';
//   }
//   if (description) {
//     description.innerHTML = '';
//   }
//   if (delivery) {
//     delivery.innerHTML = '';
//   }
// }

// function init() {
//   // Grab DOM elements on page
//   getElements();

//   // Listen for button click
//   button.addEventListener('click', handleClick, false);
// }

// function getJoke() {
//   // API Optional Configuration
//   var baseURL = 'https://sv443.net/jokeapi/v2';
//   var categories = ['Programming'];
//   var params = ['blacklistFlags=nsfw,religious,racist,sexist', 'idRange=0-100'];

//   var xhr = new XMLHttpRequest();

//   // Reference: https://sv443.net/jokeapi/v2
//   // URL to api with parameters
//   xhr.open(
//     'GET',
//     baseURL + '/joke/' + categories.join(',') + '?' + params.join('&')
//   );

//   // Example Payload
//   // {
//   //   "formatVersion": 2,
//   //     "category": "Miscellaneous",
//   //       "type": "single",
//   //         "joke": "A horse walks into a bar...",
//   //           "flags": {
//   //     "nsfw": true,
//   //       "religious": false,
//   //         "political": true,
//   //           "racist": false,
//   //             "sexist": false
//   //   }
//   // }

//   xhr.onreadystatechange = function () {
//     // readyState 4 means request has finished + we only want to parse the joke if the request was successful (status code lower than 300)
//     if (xhr.readyState == 4 && xhr.status < 300) {
//       // Transform json data to string
//       var data = JSON.parse(xhr.responseText);

//       // If type == "single", the joke only has the "joke" property
//       if (data.type == 'single') {
//         // Append joke type to DOM
//         jokeCategory.innerHTML += data.category;

//         // Append joke text to DOM
//         description.innerHTML += data.joke;
//       } else {
//         // Append the joke to DOM elements
//         jokeCategory.innerHTML += data.category;
//         description.innerHTML += data.setup;
//         delivery.innerHTML += data.delivery;
//       }
//     }
//     // readyState 4 but the network response is not in the 200 range
//     else if (xhr.readyState == 4) {
//       delivery.innerHTML +=
//         '<p>Error while requesting joke.<br>Status code: ' +
//         xhr.status +
//         '<br>Server response: ' +
//         xhr.responseText;
//     }
//   };

//   xhr.send();
// }

// window.addEventListener('load', init, false);

// Case Project 11 Rewritten using jQuery
$(document).ready(function () {
  // Global variable
  var button, jokeCategory, description, progressCount, progressBar;

  // Initialize / grab DOM elements and setup event listeners
  init();

  function clearDOM() {
    jokeCategory.html('');
    description.html('');
    delivery.html('');
    progressBar.progress('set error');
    progressBar.progress('reset');
  }

  function getJoke() {
    // API Optional Configuration
    var categories = ['Programming'];
    var params = [
      'blacklistFlags=nsfw,religious,racist,sexist',
      'idRange=0-100',
    ];
    var baseURL = 'https://sv443.net/jokeapi/v2';
    var api_url = `${baseURL}/joke/${categories.join(',')}?${params.join('&')}`;

    var settings = {
      url: api_url,
      method: 'GET',
      // Reference: http://www.dave-bond.com/blog/2010/01/JQuery-ajax-progress-HMTL5/

      // Retrieve the original xhr object, and use the data therein to calculate the progress.
      xhr: function () {
        var xhr = $.ajaxSettings.xhr();

        //Download progress
        xhr.addEventListener(
          'progress',
          function (evt) {
            // Check whether the event and it's length exist in request
            if (evt.lengthComputable) {
              // Divide the loaded data by anticipated total size multiplied by 100 to calculate the percentage loaded vs remaining
              progressCount = (evt.loaded / evt.total) * 100;

              // Update Semantic UI progress bar to warning color and width to the remaining percentage of bytes left to download in request
              progressBar.progress('set warning');
              progressBar.progress('increment', progressCount);
            }

            // The calculated percentage loaded vs remaining match, loading completed.
            if (progressCount == 100) {
              // Update Semantic UI built-in fucntion to set progress bar to success color
              progressBar.progress('set success');
            }
          },
          false
        );
        // Return the xhr object
        return xhr;
      },
    };

    $.ajax(settings)
      .done(function (data) {
        // If type == "single", the joke only has the "joke" property
        if (data.type == 'single') {
          // Append joke type to DOM
          jokeCategory.text(data.category);

          // Append joke text to DOM
          description.text(data.joke);
        } else {
          // Append joke type to DOM
          jokeCategory.text(data.category);

          // Append joke setup and delivery text to DOM
          description.text(data.setup);
          delivery.text(data.delivery);
        }
      })
      .fail(function (jqXHR, textStatus) {
        // If ajax request failed and returned a status of error
        if (textStatus == 'error') {
          // Append status to the DOM
          delivery.html(
            `<p>Error while requesting joke.<br><br>Status: ${textStatus}`
          );
        }
      });
  }

  function handleClick(e) {
    // Stop default behavior
    e.preventDefault();

    // Clear previous joke
    clearDOM();

    // Execute getJoke
    getJoke();
  }

  function getElements() {
    button = $('#button');
    jokeCategory = $('#joke-category');
    description = $('.description');
    delivery = $('.delivery');
    progressBar = $('#progressBar');
  }

  function init() {
    // Grab DOM elements on page
    getElements();

    // Listen for button click
    button.click(handleClick);
  }
});
