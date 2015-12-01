var callbackURL = process.env.FB_URL || 'http://localhost:3000/auth/facebook/callback';

module.exports = {

  facebookAuth: {
    'clientID': 'FB_KEY',
    'clientSecret': 'FB_SECRET',
    'callbackURL': callbackURL
  },
  oauth: {
   consumer_key: 'x',
   token: 'x'
  },
  yelp: {
   consumerSecret: 'x',
   tokenSecret: 'x'
  }
};
