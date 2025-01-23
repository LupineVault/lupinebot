require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Groq } = require('groq-sdk');

const app = express();
const port = 3000;

// Load API key from environment variable
const groq = new Groq(process.env.GROQ_API_KEY);

app.use(bodyParser.json());
app.use(express.static('.'));

// Store conversation history (for simplicity, stored in memory)
let conversationHistory = [];

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  // Add the user's message to the conversation history with role 'user'
  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    // Send conversation history (messages) to the chatbot API
    const chatCompletion = await groq.chat.completions.create({
      messages: conversationHistory,  // Send all messages in the history
      model: 'llama-3.1-8b-instant',
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    // Get assistant's reply from the API response
    const assistantReply = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not process your message.';

    // Add assistant's response to the conversation history with role 'assistant'
    conversationHistory.push({ role: 'assistant', content: assistantReply });

    res.json({ reply: assistantReply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ reply: 'Error: Unable to process the request.' });
  }
});

// Clear conversation history endpoint (optional)
app.post('/clear-convo', (req, res) => {
  conversationHistory = [];  // Reset conversation history
  res.json({ reply: 'Conversation history cleared.' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
