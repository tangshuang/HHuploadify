var express = require('express')
var fileUpload = require('express-fileupload')
var app = express()
var open = require('open')

app.use(fileUpload())
app.use(express.static(__dirname))
app.post('/upload', (req, res) => {
  console.log(req.files)
  res.header('Content-Type', 'text/plain')
  res.json({
    id: Date.now(),
    url: 'http://localhost:8088/screenshot.png',
  })
})

app.listen(8088, () => {
  open('http://localhost:8088/demo/index.html')
})
