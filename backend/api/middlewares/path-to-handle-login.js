import fetch from 'node-fetch';
import mapLoginFormToApi from '../library/login-field-mapping.js'
import UrlMapping from '../models/url-mapings.js'


const handleLogin = async (req, res) => {
  try {
    let apiTarget = 'http://10.0.253.185';

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
      let apiUrl;
      let mappedPayload;
      let body;
      let queryString;
      let queryParams;
      if (urlMapping.path === '/login') {

        // Map login form fields to API fields using the library function
        mappedPayload = await mapLoginFormToApi(req.body, urlMapping.data_mapping);
        // Log the mapped payload (for debugging purposes)
        //console.log('Mapped Login Payload:', mappedPayload);

        body = JSON.stringify(mappedPayload);
        apiUrl = `${apiTarget}${urlMapping.action_url}`;

      } else if (urlMapping.path.startsWith('/user-details/')) {

        const user_id = requestedPath.split('/').pop(); // Extract user_id from the path
        const rewrittenPath = urlMapping.action_url.replace(':user_id', user_id);
        // console.log('Rewritten URL:', rewrittenPath);
        apiUrl = `${apiTarget}${rewrittenPath}`;
        //console.log('----------------:', apiUrl);
        
      } else if (urlMapping.path === '/role-maps') {
        // Handle "/role-maps" case with query parameters
        queryParams = {
          action: req.query.action || 'default',
          'filter-user-id': req.query['filter-user-id'] || 'default',
        };

        queryString = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        //console.log(">>>>>>>>>>>11",queryString)

        apiUrl = `${apiTarget}${urlMapping.action_url}`;

        //console.log("(*(((((",apiUrl);

      }

      // Make a POST request to the external server
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

    } else {
      const error = "Page not found";
      throw new Error(error);
    }

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

