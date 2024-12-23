const http = require('http');
const express = require('express');
const app = express();
const OpenAI= require('openai');
const API_KEY = process.env.chatGPT_key;

app.use(function (req, res, next) {  
    if(req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next()
});

app.use(express.json({
  type: ['application/json', 'text/plain'],
  limit: '50mb'
}));

app.post('/chatGPT/spelling', async (req, res) => {

  const text = req.body.text;
  const prompt = req.body.prompt;
  const description = req.body.description;
  
  console.log(text);
  let answer = await callChatGPT(text, prompt, description);

  strippedAnswer = extractArrayFromString(answer);

  console.log(answer);
  console.log(strippedAnswer);

  res.json(strippedAnswer);
})

app.post('/chatGPT/facts', async (req, res) => {

  const text = req.body.text;
  const prompt = req.body.prompt;
  const description = req.body.description;
  
  console.log(text);
  let answer = await callChatGPT(text, prompt, description);

  strippedAnswer = extractArrayFromString(answer);

  console.log(answer);
  console.log(strippedAnswer);

  res.json(strippedAnswer);
})

app.post('/chatGPT/comments', async (req, res) => {

  const text = req.body.text;
  const prompt = req.body.prompt;
  const description = req.body.description;
  
  console.log(text);
  let answer = await callChatGPT(text, prompt, description);

  strippedAnswer = extractArrayFromString(answer);

  console.log(answer);
  console.log(strippedAnswer);

  res.json(strippedAnswer);
})

app.post('/chatGPT/article', async (req, res) => {

  const text = req.body.text;
  const prompt = req.body.prompt;
  const description = req.body.description;
  
  console.log(text);
  let answer = await callChatGPT(text, prompt, description);


  console.log(answer);


  res.json(answer);
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, async() => console.log(`Server is listening on port ${PORT}`));


/////////// funkcije 

function extractArrayFromString(inputString) {
  const match = inputString.match(/\[.*\]/s);
  
  if (match) {
      return match[0]; 
  } else {
      return null; 
  }
}

async function callChatGPT(text, prompt, description) {

  try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: description},
            { role: 'user', content: prompt + text}
          ],
          temperature: 0.2,
          max_tokens: 3200,
          top_p: 1

        })
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.choices[0].message.content; 
    } catch (error) {
      return error.message
    }
  }