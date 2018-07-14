# Open States Twitter bot!


This is a template to create your own Twitter bot that tweets out legislation currently being worked on for a given state, utilizing the
[Open States API](http://docs.openstates.org/en/latest/api/ ). See this [bot here](https://twitter.com/LawsMass)!

## Tutorial

1.  Create a new Twitter account and a new Twitter app. (Check out the Botwiki Tutorial [here](https://glitch.com/~twitterbot).)
2.  Sign up for an Open States API key [here](https://openstates.org/api/register/).
3.  Update the .env file with your Twitter API key/secrets, Open States API key, and change the BOT_ENDPOINT (it could just be random letters).
4.  In the code, update the URL's state param to whatever state you want! This bot is set up to query MA's legislation
5.  Set up a free service (cron-job.org, Uptime Robot, or a similar one) to wake up your bot every 25+ minutes and tweet. Use https://YOUR_PROJECT_NAME.glitch.me/BOT_ENDPOINT as a URL to which to send the HTTP request.




This is currently running using [Glitch.com](https://glitch.com/edit/#!/dull-equinox). Remix the code there and run your own bot! :)  
