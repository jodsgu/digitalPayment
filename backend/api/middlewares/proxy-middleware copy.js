const { createProxyMiddleware } = require('http-proxy-middleware');
const UrlMapping = require('../models/urlmapings')
// Import the LoginFieldMapping model
const mapLoginFormToApi = require('../library/login-field-mapping');





// Create proxy middleware for target server
const targetProxyMiddleware = createProxyMiddleware({
  target: 'http://10.0.253.185',
  changeOrigin: true,
  ws: true,
  pathRewrite: async (path, req) => {
    // Parse JSON from the request body

   // console.log("mmmmmmm-->", req.body)
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
        /* // Handle "/login" case
        // Map login form fields to API fields using the library function

       // console.log("77777");
       // const mappedPayload = await mapLoginFormToApi(req.body);
       // console.log("88888");
      //  let myobj = {test1:'test1',test2:'test2'}
        // Log the mapped payload (for debugging purposes)
        //console.log('Mapped Login Payload:', mappedPayload);
        //req.body = mappedPayload;
        




        console.log('Rewritten URL:', urlMapping.action_url);
        return urlMapping.action_url; */

        // Handle "/login" case
        // Map login form fields to API fields using the library function
        const mappedPayload = await mapLoginFormToApi(req.body);
        //console.log(">>>>>>>>",typeof mappedPayload)
        // Update Content-Length header based on mapped payload
        req.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(mappedPayload));

        // Replace request body with mapped payload
        
        req.body = JSON.stringify(mappedPayload);
        console.log(";;;;;;;;;",typeof req.body)

        // Log the mapped payload (for debugging purposes)
        console.log('Mapped Login Payload:', mappedPayload);

        console.log('Rewritten URL:', urlMapping.action_url);
        return urlMapping.action_url;

      } else if (urlMapping.path.startsWith('/user-details/')) {
        // Handle "/user-details/:user_id" case
        const user_id = requestedPath.split('/').pop(); // Extract user_id from the path
        const rewrittenPath = urlMapping.action_url.replace(':user_id', user_id);
        console.log('Rewritten URL:', rewrittenPath);
        return rewrittenPath;

      } else if (urlMapping.path === '/role-maps') {
        // Handle "/role-maps" case with query parameters
        const queryParams = {
          action: req.query.action || 'default',
          'filter-user-id': req.query['filter-user-id'] || 'default',
        };

        const queryString = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

        const rewrittenPath = `${urlMapping.action_url}?${queryString}`;
        console.log('Rewritten URL:', rewrittenPath);
        return rewrittenPath;
      }
    }
    // If no matching URL mapping found, return the original path
    return path;
  },
  
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
  
  onProxyReq: function (proxyReq, req, res) {
    console.log(">>>7777***>>");
    // Log the request details including the modified payload
    // console.log('Request details:');
    // console.log('Method:', req.method);
    // console.log('Original URL:', req.originalUrl);
    // console.log('Rewritten URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Payload:', req.body);
   // console.log(res)
  },
});
module.exports = targetProxyMiddleware