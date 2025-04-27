const express = require('express');
const cors = require('cors');
const { getResponse } = require('./ashaChatbotAPI');

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Asha AI Chatbot Backend!');
});

// API route for chatbot messages
app.post('/api/message', (req, res) => {
  console.log('Request received:', req.body); // Log the incoming request body
  const userMessage = req.body.message;
  console.log('User message:', userMessage);
  console.log('getResponse:', typeof getResponse); // Should log: "function" // Log the extracted user message

  // Check if userMessage is undefined
  if (!userMessage) {
    console.error('Error: No message received in request body');
    return res.status(400).json({ error: 'Message is required' });
  }

  const botResponse = getResponse(userMessage);
  console.log('Bot response:', botResponse); // Log the bot's response
  res.json({ message: botResponse });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});