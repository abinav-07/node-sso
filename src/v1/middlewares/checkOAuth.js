/* eslint-disable prefer-destructuring */
const dotenv = require('dotenv');
const { UnauthorizedException } = require('../../../exceptions/httpsException');

//Queries
const UserQueries = require('../queries/users');
const { default: axios } = require('axios');
const { OAuthSignIn } = require('../controllers/user/authentication');


dotenv.config();

const AUTH_SERVER_URL = 'http://localhost:8000';


const checkOAuthToken = async(req, res, next) => {
  try {
    //Getting token from header	
    let token= req.headers.authorization;

    if (token.startsWith('Bearer')) {
        token = token?.split(" ")[1]; //Bearer xa2132
    }
    /**
     * We can verify using different ways
     * i) Check expiry time and token in Database 
     * ii) Call Verification request in another server, useful when verifying jwt tokens and others with other servers.
     * We have implemented both methods here, another verification is in Golang server which does the same thing of checking user in DB
     **/ 

    // i) Check expiry time and token in Database 
    const checkUser=await UserQueries.getUser({token:token})

    // If user not 
    if(!checkUser || checkUser?.token_expiry_time<new Date()){
        throw "Invalid token"
    }

    // ii) Call Verification request in another server, useful when verifying jwt tokens and others with other servers.
     // Verify token with authentication server, dont forget to send token
     const headers={
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
     }
     const response = await axios.post(`${AUTH_SERVER_URL}/oauth/verify-token`, { },{
      headers,
     });
     
     // If no response 
    if(response.status!==200){
      throw "Invalid token"
    }

     req.user =checkUser || response.data.user;

    next();
  } catch (err) {
    // Redirects to Sign in screen if token validation fails.
    console.log(err)
    // We dont want to throw error, instead send user to sign in page.
    OAuthSignIn(req,res,next) 

  }
};

module.exports = checkOAuthToken;
