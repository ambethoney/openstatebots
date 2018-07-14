'use strict'
require('dotenv').config()

// Vars to run our server
const https = require('https')
const request = require('request')
const path = require('path')
const express = require('express')
const app = express()
const port = 8080

// Setting up our Twit instance
const Twit = require('twit')
const T = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
})
const stream = T.stream('user')

// Update the state=XX param with your own state!
const url = `https://openstates.org/api/v1/bills/?apikey=${process.env.OPEN_STATES_KEY}&state=ma&search_window=session&sort=updated_at`

let count = 0
app.all('/' + process.env.BOT_ENDPOINT, (request, response, next) => {
  
  const allBills = []
  const formattedStatus = []
  let status = ''

  //Fetch Data from OpenStates API
  https.get(url, (resp) => {
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk
    })

    resp.on('end', () => {
      let bills = JSON.parse(data).reverse()

      Array.from(bills).forEach( bill => {
        let tweetInfo = {}
        let trimBill = bill.bill_id.split(' ' || '_' || '-').join('')
        tweetInfo['title'] = bill.title.slice(0, 180)
        tweetInfo['url'] = `https://openstates.org/ma/bills/${bill.session}/${trimBill}`
        allBills.push(tweetInfo)
      })

      allBills.forEach( bill => {
        status = `${bill.title} ${bill.url}`
        formattedStatus.push(status)
      })

      T.post('statuses/update', { status: formattedStatus[count] }, (err, data, res) => {
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

    count++
  }).on('error', (err) => {
      return console.log('lol: ' + err.message)
  })
})

const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
