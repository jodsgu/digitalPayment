import fetch from 'node-fetch';
import mapLoginFormToApi from '../library/login-field-mapping.js'
import UrlMapping from '../models/url-mapings.js'
import extractEntityIdFromUrl from '../library/extract-entity-id-from-url.js';

const handleLogin = async (req, res) => {
  try {
    let apiTarget = 'http://10.0.253.185';
    let urlMapping;
    let apiUrl;
    let body;
    let queryParams;
    let queryString;

    
    /* const pathSegments = req.url.split('/');
    let entityId;
    if (pathSegments.length > 2) {
      entityId = pathSegments[pathSegments.length - 1];
    } */

    const  entityId = await extractEntityIdFromUrl(req.url);
    
    const pathWithoutQuery = req.url.split('?')[0];

    if (req.method === 'POST' && !entityId)   //POST request
    {
      console.log("IN POST REQUEST ")
      urlMapping = await UrlMapping.findOne({ path: pathWithoutQuery });
      // Map login form fields to API fields using the library function
      const mappedPayload = await mapLoginFormToApi(req.body, urlMapping.data_mapping);
      body = JSON.stringify(mappedPayload);
      apiUrl = `${apiTarget}${urlMapping.action_url}`;




    }
    else if (req.method === 'GET' && entityId)  //GET request
    {
      console.log("IN GET REQUEST WITH ID")
      const url = '/' + pathWithoutQuery.split('/')[1];
      urlMapping = await UrlMapping.findOne({ path: `${url}` });
      apiUrl = `${apiTarget}${urlMapping.action_url}/${entityId}`;


    }
    else if (req.method === 'GET' && !entityId && req.query.action && req.query.action === 'filter') //GET request to list entities
    {
      console.log("IN GET REQUEST WITH ID with query parameter", req.query)
      urlMapping = await UrlMapping.findOne({ path: `${pathWithoutQuery}` });

      queryParams = {
        action: req.query.action || 'default',
      };
      
      //making queryParams dynamic
      Object.keys(req.query).forEach(key => {
       
        if (key !== 'action') {
          queryParams[key] = req.query[key];
        }
      });

      queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
     
      apiUrl = `${apiTarget}${urlMapping.action_url}`;

    }
    else if (req.method === 'PUT' || req.method === 'PATCH' && entityId) 
    {
      console.log("IN PUT REQUEST WITH ID ")
      const url = '/' + pathWithoutQuery.split('/')[1];
      urlMapping = await UrlMapping.findOne({ path: `${url}` });
      apiUrl = `${apiTarget}${urlMapping.action_url}/${entityId}`;

    }
    else if (req.method === 'DELETE' && entityId) 
    {
      console.log("IN DELETE REQUEST WITH ID ")
    }




    // Make a POST GET PUT PATCH DELETE request to the external server
    const response = await fetch(`${apiUrl}?${queryString}`, {

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

