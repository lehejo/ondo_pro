window.onload = function() {
    const chatMessages = document.querySelector('#chat-messages');
    const userInput = document.querySelector('#user-input');
    const sendButton = document.querySelector('#send-button');
    const CHATGPTAPIKEY = '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';
  
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
  
    sendButton.addEventListener('click', async () => {
      const message = userInput.value.trim();
      if (message.length === 0) return;
      addMessage('나', message);
      userInput.value = '';
      const aiResponse = await fetchATResponse(message);
      addMessage('챗봇', aiResponse);
    });
  
    userInput.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        const message = userInput.value.trim();
        if (message.length === 0) return;
        addMessage('나', message);
        userInput.value = '';
        const aiResponse = await fetchATResponse(message);
        addMessage('챗봇', aiResponse);
      }
    });
  };  