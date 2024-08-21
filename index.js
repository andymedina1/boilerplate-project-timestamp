const express = require('express')
const cors = require('cors')
const path = require('node:path')
const app = express()

app.use(cors({ optionsSuccessStatus: 200 }))
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

app.get('/api/:date?', (request, response) => {
  const input = request.params.date

  const dateValidator = (input) => {
    return (new Date(input) !== 'Invalid Date') && !isNaN(new Date(input))
  }

  if (!input) {
    const timestamp = new Date().getTime()
    const date = new Date(timestamp).toUTCString()

    return response.json({ unix: timestamp, utc: date })
  }

  // validate timestamp
  if ((new Date(+input)).getTime() > 0) {
    const date = new Date(+input).toUTCString()
    return response.json({ unix: +input, utc: date })
  }

  // validate other dates
  if (!dateValidator(input)) {
    return response.json({ error: 'Invalid Date' })
  }

  const date = new Date(input)
  response.json({ unix: Date.parse(input), utc: date.toUTCString() })
})

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
