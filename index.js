const http = require('http');
const express = require('express');
const app = express();
const OpenAI= require('openai');
const API_KEY = process.env.chatGPT_key;

app.use(function (req, res, next) {  
  
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)


    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
  
    res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next()
});

app.use(express.json({
  type: ['application/json', 'text/plain'],
  limit: '50mb'
}));

app.post('/chatGPT', async (req, res) => {
    const text = req.body.text;
    console.log(text);
    /* const text = 'ovo je neki tekst kita dupe dalje nse nastavlja picka'; */
    let answer = await callChatGPT(text);
    
    console.log(answer);
    console.log(typeof answer);
    res.json(answer);
})


async function callChatGPT(text) {

 /* const prompt = `take this text in serbian and check if there is any swearing words in it. If you found them, put them in the array [] and response me only thay array. If you don't find them, return only empty array [] ` + text; */
 /* const prompt = `узмите овај текст на српском и проверите да ли има речи и реченица са правописним или граматичким грешкама. Ако сте их пронашли, ставите те речи и реченице у низ [] и одговорите ми само у том низу. Ако не пронађете речи или реченице са правописним или граматичким грешкама, вратите само празан низ [] ` + text;; */
 const prompt = `детаљно прегледај текст на српском, пронађи граматичке грешке. Стави те речи у низ [] и одговори ми само у том низу. Ако нема грешака, врати празан низ []. Ево текста: ` + text;


    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4', // Using 'gpt-4-turbo' as a placeholder
          messages: [
            { role: 'system', content: 'Ви сте асистент за проверу граматике са знањем српског језика. Пажљиво анализирајте дати текст да ли постоје граматичке, правописне или стилске грешке' },
            { role: 'user', content: prompt}
          ],
          temperature: 0.2,
          max_tokens: 150,
          top_p: 1
           // Customize this value based on your needs
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.choices[0].message.content; // Displaying the API response content
    } catch (error) {
      return error.message
    }
  }

const PORT = process.env.PORT || 3000;

app.listen(PORT, async() => console.log(`Server is listening on port ${PORT}`));
