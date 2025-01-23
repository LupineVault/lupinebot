document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const userInput = document.getElementById('user-input').value.trim();
  if (!userInput) return;

  // Display user message
  displayMessage(userInput, 'user-message');

  // Clear input field
  document.getElementById('user-input').value = '';

  // Fetch bot response from the server
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await response.json();
    // Display bot response with Markdown rendering
    displayMarkdownMessage(data.reply, 'bot-message');
  } catch (error) {
    displayMessage('Error: Unable to connect to the chatbot.', 'bot-message');
  }
}

function displayMessage(message, className) {
  const chatBox = document.getElementById('chat-box');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${className}`;
  messageDiv.textContent = message;

  // Only add the copy button for bot's messages
  if (className === 'bot-message') {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';
    copyButton.onclick = () => copyToClipboard(message);

    messageDiv.appendChild(copyButton);
  }

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function displayMarkdownMessage(markdown, className) {
  const chatBox = document.getElementById('chat-box');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${className}`;

  // Render Markdown to HTML using Marked.js
  messageDiv.innerHTML = marked.parse(markdown);

  // Only add the copy button for bot's messages
  if (className === 'bot-message') {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';
    copyButton.onclick = () => copyToClipboard(markdown);

    messageDiv.appendChild(copyButton);
  }

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function copyToClipboard(text) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
  alert('Copied to clipboard!');
}
