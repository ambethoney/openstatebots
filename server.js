'use strict'
require('dotenv').config()

'use strict'

// Vars to run our server
const https = require('https')
const request = require('request')
const path = require('path')
const express = require('express')
const app = express()
const port = 8080

app.use(express.static('public'))

let localStorage = require('node-localstorage').LocalStorage

localStorage = new localStorage('./counter')

// Setting up our Twit instance
const Twit = require('twit')
const T = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
})

const url = `https://openstates.org/api/v1/bills/?apikey=${process.env.OPEN_STATES_KEY}&state=${process.env.STATE}&search_window=session&sort=updated_at`
let count = localStorage.getItem('count')

let nextStatus = ''

app.all('/' + process.env.BOT_ENDPOINT, (request, response) => {

  const allBills = []
  const formattedStatus = []
  let status = ''

  // Fetch Data from OpenStates API
  https.get(url, (resp) => {
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk
    })

    resp.on('end', () => {

      let bills = JSON.parse(data).reverse()

      // Pull info we want from each obj
      Array.from(bills).forEach( bill => {
        let tweetInfo = {}
        let trimBill = bill.bill_id.split(' ' || '_' || '-').join('')
        tweetInfo['title'] = bill.title.slice(0, 180)
        tweetInfo['url'] = `https://openstates.org/${process.env.STATE}/bills/${bill.session}/${trimBill}`
        allBills.push(tweetInfo)
      })

      // Format the status
      allBills.forEach( bill => {
        status = `${bill.title} ${bill.url}`
        formattedStatus.push(status)
      })

      // Check to make sure there is a queued status
      if (formattedStatus[count]) {
        nextStatus = formattedStatus[count]
      } else {
        nextStatus = 'No updates, check back soon!'
      }

      // Post status!
      T.post('statuses/update', { status: nextStatus }, (err, data, res) => {
        if (err){
          response.sendStatus(500)
          console.log('Error!')
          console.log(err)
        }
        else{
          response.sendStatus(200)
        }
      })
    })

    localStorage.setItem('count', count++)
  }).on('error', (err) => {
      return console.log('lol: ' + err.message)
  })
})


const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
