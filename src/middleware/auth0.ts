export const {
    auth,
    claimCheck,
    InsufficientScopeError,
  } = require("express-oauth2-jwt-bearer");
  const dotenv = require("dotenv");
  
  dotenv.config();
  
  export const validateAccessToken = auth({
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    audience: process.env.AUTH0_AUDIENCE,
  });  
  
  module.exports = {
    validateAccessToken
  };