const UrlMapping = require('../models/urlmapings')
// Import the LoginFieldMapping model
const mapLoginFormToApi = require('../library/login-field-mapping');


const mappingMiddleware = async(req, res, next) => {

  try{



    console.log("1111",req.body)
  // Extract the path from the URL
  const requestedPath = req.url;
  // Remove query parameters from the path for lookup
  const pathWithoutQuery = requestedPath.split('?')[0];


  let urlMapping;
  if (pathWithoutQuery.startsWith('/user-details/')) {
    urlMapping = await UrlMapping.findOne({ path: '/user-details/:user_id' });
  } else {
    urlMapping = await UrlMapping.findOne({ path: pathWithoutQuery });
  }

  if (urlMapping) {
    if (urlMapping.path === '/login') {
      

      // Handle "/login" case
      // Map login form fields to API fields using the library function
      const mappedPayload = await mapLoginFormToApi(req.body);
      
      console.log("333333",mappedPayload)
      
     req.body = mappedPayload;

      console.log("222222",req.body)
      next()

    } 
  }

  }catch(err){
    console.log("Authentication Failure")

  }



  



}
module.exports = mappingMiddleware