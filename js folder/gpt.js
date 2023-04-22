window.onload = async function () {
    const chatMessages = document.querySelector(".chatroom");
    const CHATGPTAPIKEY = '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';

    // 이전에 저장된 날씨 정보 가져오기
    const weatherData = JSON.parse(localStorage.getItem('weatherData'));

    if (weatherData) {
        const cityName = weatherData.name;
        const description = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;

        const message = `현재 ${cityName}의 날씨는 ${description}, 기온은 ${temperature}℃ 입니다.`;
        addMessage("Bot", message);
    }

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = sender + ': ' + message;
        chatMessages.prepend(messageElement);
    }

    async function fetchATResponse(prompt) {
        const apiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATGPTAPIKEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 60,
                n: 1,
                stop: '\n',
            }),
        };

        try {
            const response = await fetch(apiEndpoint, requestOptions);
            const data = await response.json();
            const aiResponse = data.choices[0].text.trim();
            return aiResponse;
        } catch (error) {
            console.error('OpenAI API 호출 중 오류 발생:', error);
            return 'OpenAI API 호출 중 오류 발생';
        }
    }
}