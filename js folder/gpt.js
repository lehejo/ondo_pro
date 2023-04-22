window.onload = async function () {
    const chatMessages = document.querySelector(".chatroom");
    const weatherBtn = document.querySelector(".weather-button");
    const resetBtn = document.querySelector(".reset");
    const CHATGPTAPIKEY = "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";
    const WEATHERAPIKEY = "0f14bd43cf27ee83d11fead9b7d56917";

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
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    let weatherFetched = false;

    async function getCurrentWeather(latitude, longitude) {
        try {
            // 이전에 날씨 정보를 가져왔다면 바로 반환
            if (weatherFetched) {
                const weatherData = JSON.parse(localStorage.getItem("weatherData"));
                return weatherData;
            }
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
            return weatherData;
        } catch (error) {
            console.error("날씨 정보 호출 중 오류 발생:", error);
            addMessage("Chat GPT", "날씨 정보 호출 중 오류 발생");
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
        if (temperature > 4) {
            cloth = '겉옷으로 패딩이나 코트, 상의로 따뜻한 니트';
        } else if (temperature > 12) {
            cloth = '상의는 자켓이나 가디건, 하의는 면바지';
        } else if (temperature > 22) {
            cloth = '상의는 얇은 옷이나 반팔, 하의는 반바지';
        }
        return cloth;
    }

    weatherBtn.addEventListener("click", async function () {
        // 사용자의 위치 정보 허용 여부 체크
        if (!navigator.geolocation) {
            addMessage("Chat GPT", "죄송합니다. 이 브라우저에서는 위치 정보를 지원하지 않습니다.");
            return;
        }
        try {
            const position = await getLocation();
            const {
                latitude,
                longitude
            } = position.coords;
            const weatherData = await getCurrentWeather(latitude, longitude);
            const temperature = weatherData.main.temp;
            const cityName = weatherData.name;
            const description = weatherData.weather[0].description;
            const message = `현재 ${cityName}의 날씨는 ${description}, 기온은 ${temperature}℃ 입니다.`;
            // 이미 날씨 정보를 출력했다면 추가적으로 출력하지 않음
            if (!weatherFetched) {
                addMessage("Chat GPT", message);
            }
            addMessage("사용자", "오늘 날씨를 바탕으로 옷차림을 추천해 줘!");
            const cloth = recommendCloth(temperature);
            const clothMessage = `오늘 추천하는 옷차림은 ${cloth}입니다.`;
            addMessage("Chat GPT", clothMessage);
        } catch (error) {
            console.error(error);
            addMessage("Chat GPT", "날씨 정보를 가져오는 중에 오류가 발생했습니다.");
        }
    });

    resetBtn.addEventListener("click", function () {
        localStorage.removeItem("weatherData");
        addMessage("Chat GPT", "날씨 정보가 초기화되었습니다.");
    });
}