const { createProxyMiddleware } = require('http-proxy-middleware');
const UrlMapping = require('../models/urlmapings')
// Import the LoginFieldMapping model
const mapLoginFormToApi = require('../library/login-field-mapping'); 

// Helper function to parse JSON from request body
const parseJsonBody = (req) => {
  try {
    return JSON.parse(req.body.toString());
  } catch (error) {
    console.error('Error parsing JSON from request body:', error);
    return {};
  }
};



// Create proxy middleware for target server
const targetProxyMiddleware = createProxyMiddleware({
  target: 'http://10.0.253.185',
  changeOrigin: true,
  pathRewrite: async (path, req) => {
   // Parse JSON from the request body
    const requestBody = parseJsonBody(req);
    console.log("mmmmmmm-->",requestBody)
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

  },
});
module.exports = targetProxyMiddleware