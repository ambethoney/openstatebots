'use strict';

const https = require('https');
const request = require('request');
const path = require('path');
const express = require('express');
const app = express();
const port = 8080;
const myKey = '7fc3e0b4-9ee9-4b29-8c51-39fbf5345c55';
const url = 'https://openstates.org/api/v1/bills/?apikey='+myKey+'&state=ma&search_window=session&sort=updated_at';
const queuedTweets = [];
const deployedTweets = [];

//TODO:

//check that new updated_at  > last updated_at

//need a link for more info on bill -> add image w/ link!


app.get("/", function (request, response, next) {
  let lastBill;
  let tweet=''

  //Fetch Data from OpenStates API
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk
    })

    resp.on('end', () => {
      //Parse & reverse data, set unique ID
      let bills = JSON.parse(data).reverse();
      let i = 0;

      Array.from(bills).forEach( item => {
        //Format tweets,
        let tweetInfo = {}
        let billIdentifier = item.bill_id.split(" " || "_" || "-").join('');
        tweetInfo['id'] = i +=1;
        tweetInfo['title'] = item.title.slice(0, 140);
        tweetInfo['url'] = 'https://openstates.org/ma/bills/' + item.session + '/'+ billIdentifier;
        tweetInfo['updated'] = item.updated_at;
        lastBill =queuedTweets[queuedTweets.length-1];
        queuedTweets.push(tweetInfo)
        //console.log(lastBill.id)
        // if(lastBill.updated_at < tweetInfo.updated_at){
        //   console.log("worked, " +lastBill.updated_at + " " + tweetInfo.updated_at)
        // }
      });

      queuedTweets.forEach((item, index) =>{
        setTimeout(function(){
          let newTweet = queuedTweets.shift()
          tweet = '<a href="'+ newTweet.url+'" target="_blank">'+newTweet.title+'</a>';
          console.log(tweet)
          return tweet
        }, 3000*(index+1));
      })
      console.log(tweet)
      response.send(tweet)
      deployedTweets.push(tweet)


    })
  }).on("error", (err) => {
      return console.log("Error: " + err.message);
  });
});


const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
