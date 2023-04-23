window.onload = async function () {
    const config = await getConfig();
    const chatMessages = document.querySelector(".chatroom");
    const weatherBtn = document.querySelector(".weather-button");
    const resetBtn = document.querySelector(".reset");
    const CHATGPTAPIKEY = config.CHATGPTAPIKEY;
    const WEATHERAPIKEY = config.WEATHERAPIKEY;
    let weatherFetched = false;

    function addMessage(sender, message) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");

        const senderElement = document.createElement("div");
        senderElement.classList.add("sender");
        senderElement.innerText = sender;

        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerText = message;

        messageContainer.appendChild(senderElement);
        messageContainer.appendChild(messageElement);

        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function getLocation() {
        const params = new URLSearchParams(window.location.search);
        const lat = params.get("lat");
        const lng = params.get("lng");

        if (lat && lng) {
            return {
                coords: {
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lng),
                },
            };
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    async function getCurrentWeather(latitude, longitude) {
        try {
            const lat = latitude || (await getLocation()).coords.latitude;
            const lon = longitude || (await getLocation()).coords.longitude;
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHERAPIKEY}&units=metric`
            );
            const weatherData = await response.json();
            const cityName = weatherData.name;
            const description = weatherData.weather[0].description;
            const temperature = weatherData.main.temp;

            const message = `현재 ${cityName}의 날씨는 ${description}, 기온은 ${temperature}℃ 입니다.`;
            addMessage("Chat GPT", message);

            // 날씨 정보를 로컬 스토리지에 저장
            localStorage.setItem("weatherData", JSON.stringify(weatherData));
            weatherFetched = true; // 날씨 정보를 가져온 상태로 설정
            return temperature; // 온도 정보 반환
        } catch (error) {
            console.error("오류 발생: 날씨 정보 호출 과정", error);
            const message = `오류 발생: 날씨 정보 호출 과정 - ${error.message}`;
            window.alert(message); // 메시지 창으로 오류 메시지 표시
            addMessage("Chat GPT", message); // 채팅창에 오류 메시지 추가
            return null;
        }
    }

    async function chatfetch(prompt) {
        const apiEndpoint = "https://api.openai.com/v1/engines/davinci-codex/completions";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${CHATGPTAPIKEY}`,
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 60,
                n: 1,
                stop: "\n",
            }),
        };
        const response = await fetch(apiEndpoint, requestOptions);
        const data = await response.json();
        return data.choices[0].text.trim();
    }

    function recommendCloth(temperature) {
        let cloth;
        if (temperature <= 4) {
            cloth = '패딩, 코트, 니트';
        } else if (temperature <= 12) {
            cloth = '자켓, 가디건, 면바지';
        } else if (temperature <= 22) {
            cloth = '얇은 긴팔, 반팔, 반바지';
        } else {
            cloth = '민소매, 반바지';
        }
        return cloth;
    }

    weatherBtn.addEventListener("click", async function () {
        try {
            let position = await getLocation();
            let {
                latitude,
                longitude
            } = position.coords;
            let weatherData = await getCurrentWeather(latitude, longitude);
            let temperature = weatherData.main.temp;

            addMessage("사용자", "오늘 날씨를 바탕으로 옷차림을 추천해 줘!");
            let cloth = recommendCloth(temperature);
            let message = `오늘의 추천 옷차림은 ${cloth}입니다`;
            addMessage("Chat GPT", message);
        } catch (error) {
            console.error("오류 발생: 날씨 정보 호출 과정", error);
            const message = `오류 발생: 날씨 정보 호출 과정 - ${error.message}`;
            window.alert(message); // 메시지 창으로 오류 메시지 표시
            addMessage("Chat GPT", message); // 채팅창에 오류 메시지 추가
            return null;
        }
    });

    resetBtn.addEventListener("click", function () {
        localStorage.removeItem("weatherData");
        addMessage("Chat GPT", "날씨 정보가 초기화되었습니다.");
    });

    async function getConfig() {
        const response = await fetch("./js/apikey.js");
        const text = await response.text();
        return JSON.parse(text.replace(/^[^{]*|[^}]*$/g, ''));
    }
}