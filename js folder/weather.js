// 파일 전송을 위한 URL 주소
const FILE_UPLOAD_URL = "https://api.openai.com/v1/engines/davinci-codex/completions";

window.onload = function() {
    const WEATHERAPIKEY = "0f14bd43cf27ee83d11fead9b7d56917";
    const weatherBtn = document.querySelector(".weather-button");
  
    weatherBtn.addEventListener("click", () => {
      const isLocationAllowed = localStorage.getItem('locationAllowed');
      if (isLocationAllowed === 'true') {
        getCurrentWeather();
      } else {
        requestLocationPermission();
      }
    });
  
    function requestLocationPermission() {
      navigator.permissions.query({name:'geolocation'})
        .then(permission => {
          if (permission.state === 'granted') {
            localStorage.setItem('locationAllowed', 'true');
            getCurrentWeather();
          } else if (permission.state === 'prompt') {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                localStorage.setItem('locationAllowed', 'true');
                getCurrentWeatherByLocation(position.coords.latitude, position.coords.longitude);
              },
              (error) => {
                console.log(error);
              }
            );
          } else {
            console.log('Geolocation permission is denied.');
          }
        })
        .catch(error => {
          console.log('Error requesting location permission:', error);
        });
    }
  
    function getCurrentWeatherByLocation(latitude, longitude) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHERAPIKEY}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
          const cityName = data.name;
          const description = data.weather[0].description;
          const temperature = data.main.temp;
  
          const weatherData = {
            city: cityName,
            description: description,
            temperature: temperature
          };
  
          // 파일 전송
          const formData = new FormData();
          formData.append("weatherData", JSON.stringify(weatherData));
  
          fetch(FILE_UPLOAD_URL, {
            method: "POST",
            body: formData
          })
          .then(response => {
            if (response.ok) {
              console.log("파일 전송 성공");
            } else {
              console.log("파일 전송 실패");
            }
          })
          .catch(error => console.log("파일 전송 중 오류 발생:", error));
  
          localStorage.setItem('weatherData', JSON.stringify(data));
        })
        .catch((error) => console.log(error));
    }
  
    function getCurrentWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        getCurrentWeatherByLocation(latitude, longitude);
      }, (error) => {
        console.log(error);
      });
    }
}