// oauth.js
const { Issuer } = require('openid-client');
const dotenv = require('dotenv');

dotenv.config();
let OAuthClient;

const initOAuth = async () => {
  if (!OAuthClient) {
    const issuer = await Issuer.discover('https://accounts.google.com');

    OAuthClient = new issuer.Client({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      // Redirecting to golang server's callback
      redirect_uris: ['http://localhost:8000/oauth/callback'],
      response_types: ['code', 'offline_access'],
    });
  }

  return OAuthClient;
};

module.exports = initOAuth;
