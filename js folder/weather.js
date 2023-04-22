// 파일 전송을 위한 URL 주소
const FILE_UPLOAD_URL = "https://lehejo.github.io/ondo_pro/";

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
    navigator.permissions.query({
            name: 'geolocation'
        })
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
            // 날씨 정보를 로컬 스토리지에 저장
            localStorage.setItem('weatherData', JSON.stringify(data));
        })
}