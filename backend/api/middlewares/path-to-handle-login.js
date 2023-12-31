import fetch from 'node-fetch';
import mapLoginFormToApi from '../library/login-field-mapping.js'
import UrlMapping from '../models/url-mapings.js'


const handleLogin = async (req, res) => {
  try {
    let apiTarget = 'http://10.0.253.185';
    let urlMapping;
    let apiUrl;
    let body;
    let queryParams;
    let queryString;


    

    const pathWithoutQuery = req.url.split('?')[0];
    console.log("****", pathWithoutQuery);


    if (req.method === 'POST')   //POST request
    {
      console.log("IN POST REQUEST ")

      urlMapping = await UrlMapping.findOne({ path: pathWithoutQuery });
      if (urlMapping) {
        // Map login form fields to API fields using the library function
        const mappedPayload = await mapLoginFormToApi(req.body, urlMapping.data_mapping);
        body = JSON.stringify(mappedPayload);
        apiUrl = `${apiTarget}${urlMapping.action_url}`;
      }
      else {
        const error = "Page not found";
        throw new Error(error);
      }


    }
    else if (req.method === 'GET')  //GET request
    {
      console.log("IN GET REQUEST WITH ID")
      if (req.query.action && req.query.action === 'filter') {
        console.log("Query string")
        urlMapping = await UrlMapping.findOne({ path: `${pathWithoutQuery}` });

        if (urlMapping) {
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
        } else {
          const error = "Page not found";
          throw new Error(error);
        }

      } else {
        console.log("Normal get request ")
        urlMapping = await UrlMapping.findOne({ path: pathWithoutQuery });
        if (urlMapping) {
          apiUrl = `${apiTarget}${urlMapping.action_url}`;

        }
        else {
          const error = "Page not found";
          throw new Error(error);
        }
      }
     }
    


    // console.log(">>>>>>>>>>>>>",req.headers.authorization)

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
    console.log(">>>>", error.message);

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

