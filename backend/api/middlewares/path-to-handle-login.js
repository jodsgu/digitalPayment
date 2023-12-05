import fetch from 'node-fetch';
import mapLoginFormToApi from '../library/login-field-mapping.js'
import UrlMapping from '../models/url-mapings.js'


const handleLogin = async (req, res) => {
  try {
    let apiTarget = 'http://10.0.253.185';
    
    let apiUrl;
    let body;
    const pathSegments = req.url.split('/');
    let entityId;
    

    if (pathSegments.length > 2) {
      entityId = pathSegments[pathSegments.length - 1];
    }

    const pathWithoutQuery = req.url.split('?')[0];

    console.log("1111111", entityId,pathWithoutQuery);
   
   

    if(req.method === 'POST' && !entityId)   //POST request
    {
      console.log("IN POST REQUEST ")
      const urlMapping = await UrlMapping.findOne({ path: pathWithoutQuery });
      // Map login form fields to API fields using the library function
      const mappedPayload = await mapLoginFormToApi(req.body, urlMapping.data_mapping);
      body = JSON.stringify(mappedPayload);
      apiUrl = `${apiTarget}${urlMapping.action_url}`;

      


    }
    else if(req.method === 'GET' && entityId)  //GET request
    {
      console.log("IN GET REQUEST WITH ID")
    }
    else if(req.method === 'GET' && req.query.action && req.query.action === 'filter') //GET request to list entities
    {
      console.log("IN GET REQUEST WITH ID with query parameter")
    }else{
      console.log("HERE")
    }

    // Make a POST request to the external server
    const response = await fetch(`${apiUrl}`, {

      method: `${req.method}`,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { Authorization: `${req.headers.authorization}` } : {}),

      },
      ...(req.method === 'POST' ? { body: `${body}` } : {}),

    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }

    // Parse the response JSON
    const responseData = await response.json();

    // Send the response back to the client
    res.json(responseData);





  } catch (error) {
    //console.log(">>>>", error.message);

    if (error.error) {
      // Handle the first type of error
      res.status(400).json({
        success: false,
        message: error.error
      });
    } else if (error.message) {
      // Handle the second type of error
      res.status(404).json({
        success: false,
        message: error.message
      });
    } else {
      // Handle other types of errors with a default message
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

};

export default handleLogin;

