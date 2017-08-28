var express = require('express')
var app = express()
var open = require('open')

app.use(express.static(__dirname))
app.post('/upload', (req, res) => {
  res.json({
    id: Date.now(),
    url: 'http://localhost:8088/screenshot.png',
  })
})

app.listen(8088, () => {
  open('http://localhost:8088/demo/index.html')
})
