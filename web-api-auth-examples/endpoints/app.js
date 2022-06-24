const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

// respond with "hello world" when a GET request is made to the homepage
app.get('/endpoint', (req, res) => {
  res.send('hello world')
});
app.listen(8888);