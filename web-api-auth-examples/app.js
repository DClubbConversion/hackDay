
/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

 var express = require('express'); // Express web server framework
 var request = require('request'); // "Request" library
 var cors = require('cors');
 var querystring = require('querystring');
 var cookieParser = require('cookie-parser');
 
 var client_id = '8dd6669e99ea4d3eac52378c98163365'; // Your client id
 var client_secret = '57d96a23a9034bc9b0165da106393b65'; // Your secret
 var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
 
 /**
  * Generates a random string containing numbers and letters
  * @param  {number} length The length of the string
  * @return {string} The generated string
  */
 var generateRandomString = function(length) {
   var text = '';
   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
   for (var i = 0; i < length; i++) {
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
 };
 
 var stateKey = 'spotify_auth_state';
 
 var app = express();
 
 app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());
 
 app.get('/login', function(req, res) {
 
   var state = generateRandomString(16);
   res.cookie(stateKey, state);
 
   // your application requests authorization
   var scope = 'user-read-private user-read-email';
   res.redirect('https://accounts.spotify.com/authorize?' +
     querystring.stringify({
       response_type: 'code',
       client_id: client_id,
       scope: scope,
       redirect_uri: redirect_uri,
       state: state
     }));
 });

 app.get('/get-suggestions', function(req, res) {
   // make api request
   let result = undefined;

   fetch("https://api.spotify.com/v1/search?q=justin%20bieber&type=track%2Cartist&market=ES&limit=10&offset=5", {
     headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer BQB7pJ3nCCwF7jzOlCuyUXM9_DaYVAeBRKKUYfkYtAgm5xKs5NCs3Y-9dh-Y4UObozy2n79txhTFcqn0nWOc060Fd0quwQzHyI76gP-WR-m6407iJqp9xu2S0dZQptPc5DBW7qWBI-Tc0dIrL-W4p3qWWmGG6vXW1hzN-vtB-rkhZeNlPOlAEsFm8oUSDDL_0mFeITNd0KYjTqV49TIffw&refresh_token=AQASRUprTrvLgUA0Hyw7BqyT8t0BwfgQEHxboj8FQU1nWD8yCENoyoX1UZF8WEIX9mEE4PBAdKYUJ5DIEuXEynVMDixZEc87w0GxubD_IAfTXZ3fTaU4mbucRQ0clV7bNK8"
     }
   })
   .then(response => response.json())
   .then(data =>  {
     console.log(data);
  })

    res.send({
      result,
    });
 });

 
 app.get('/callback', function(req, res) {
 
   // your application requests refresh and access tokens
   // after checking the state parameter
 
   var code = req.query.code || null;
   var state = req.query.state || null;
   var storedState = req.cookies ? req.cookies[stateKey] : null;
 
   if (state === null || state !== storedState) {
     res.redirect('/#' +
       querystring.stringify({
         error: 'state_mismatch'
       }));
   } else {
     res.clearCookie(stateKey);
     var authOptions = {
       url: 'https://accounts.spotify.com/api/token',
       form: {
         code: code,
         redirect_uri: redirect_uri,
         grant_type: 'authorization_code'
       },
       headers: {
         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
       },
       json: true
     };
 
     request.post(authOptions, function(error, response, body) {
       if (!error && response.statusCode === 200) {
 
         var access_token = body.access_token,
             refresh_token = body.refresh_token;
 
         var options = {
           url: 'https://api.spotify.com/v1/me',
           headers: { 'Authorization': 'Bearer ' + access_token },
           json: true
         };
 
         // use the access token to access the Spotify Web API
         request.get(options, function(error, response, body) {
           console.log(body);
         });
 
         // we can also pass the token to the browser to make requests from there
         res.redirect('/#' +
           querystring.stringify({
             access_token: access_token,
             refresh_token: refresh_token
           }));
       } else {
         res.redirect('/#' +
           querystring.stringify({
             error: 'invalid_token'
           }));
       }
     });
   }
 });
 
 app.get('/refresh_token', function(req, res) {
   console.log('called!');
   // requesting access token from refresh token
   var refresh_token = req.query.refresh_token;
   var authOptions = {
     url: 'https://accounts.spotify.com/api/token',
     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
     form: {
       grant_type: 'refresh_token',
       refresh_token: refresh_token
     },
     json: true
   };
 
   request.post(authOptions, function(error, response, body) {
     console.log('request post')
     if (!error && response.statusCode === 200) {
       console.log('error and status code');
       var access_token = body.access_token;
       res.send({
         'access_token': access_token
       });
     }
   });
 });

 app.get('/', (req, res) => {
  res.status(200);

  app.use(express.static('/public'));
});

 
 console.log('Listening on 8888');
 app.listen(8888);
 
