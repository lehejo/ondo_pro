// Execute the run() function when the button is clicked
document.getElementById('.RUN').addEventListener('click', run);

document.addEventListener('DOMContentLoaded', function () {

      // The run() function
      function run() {
        // Get the user's message from the input field
        var messageInput = document.getElementById('message-input');
        var message = messageInput.value;

        // Send the message to ChatGPT
        var chatGptFrame = document.getElementById('chatgpt-frame');
        chatGptFrame.contentWindow.postMessage(message, '*');

        // Clear the input field
        messageInput.value = '';

        // Wait for a response from ChatGPT
        window.addEventListener('message', function (event) {
          if (event.origin !== 'https://api-inference.huggingface.co') {
            return;
          }

          // Display the response from ChatGPT
          var chatBox = document.getElementById('chat-box');
          var response = event.data[0].generated_text;
          chatBox.innerHTML += '<p><strong>You:</strong> ' + message + '</p>';
          chatBox.innerHTML += '<p><strong>ChatGPT:</strong> ' + response + '</p>';

          // Get the user's location
          navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // Send a request to the weather API
            var apiKey = '0f14bd43cf27ee83d11fead9b7d56917';
            var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = 'json';
            request.send();

            // Wait for a response from the weather API
            request.onload = function () {
              var weatherData = request.response;
              var temperature = weatherData.main.temp - 273.15;
              var description = weatherData.weather[0].description;

              // Recommend an outfit based on the temperature
              var outfit = '';
              if (temperature < 10) {
                outfit = 'Coat, scarf, and gloves';
              } else if (temperature < 15) {
                outfit = 'Light jacket or sweater';
              } else if (temperature < 20) {
                outfit = 'T-shirt or blouse with a light jacket';
              } else if (temperature < 25) {
                outfit = 'Shorts or a summer dress';
              } else {
                outfit = 'T-shirt and shorts';
              }

              // Send the weather information to ChatGPT
              var weatherInfo = 'The weather in your location is ' + description + ' with a temperature of ' + temperature.toFixed(1) + ' degrees Celsius. You should wear: ' + outfit;
              chatGptFrame.contentWindow.postMessage(weatherInfo, '*');
            };
          });
        });
      }
});