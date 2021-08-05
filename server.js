require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const verifyUrl = require('./verifyUrl');
const database = require('./database')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// shorturl API endpoint
app.post('/api/shorturl', verifyUrl, async function(req, res) {
  const urlObj = await database.shortNewUrl(req.body.url)
  res.json({original_url: urlObj.originalUrl, short_url: urlObj.shortUrl})
})

app.get('/api/shorturl/:short', async function(req,res) {
  const urlObj = await database.findShortenedUrl(req.params.short)
  res.json(urlObj ? {original_url: urlObj.originalUrl, short_url: urlObj.shortUrl} : {error: 'No short URL found for the given input'})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
