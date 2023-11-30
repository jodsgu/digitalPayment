const express = require("express");
const cors = require('cors');

//const { createProxyMiddleware } = require('http-proxy-middleware');

const mappingMiddleware = require('./api/middlewares/mapping-middleware')
const dbConnection = require('./db');
//const UrlMapping = require('./api/models/urlmapings');
const port = 3000;

const app = express();

app.use(cors());
dbConnection();

//import proxy middleware
const targetProxyMiddleware = require('./api/middlewares/proxy-middleware')




// Dynamically route requests based on URL path
app.all('*',mappingMiddleware, async (req, res, next) => {
  try {
    const path = req.url; // Extract the path from the URL
    console.log("Requested path:", path);

    // Proxy the request to the target server, replacing the path with the action_url
    targetProxyMiddleware(req, res, next, {});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});







// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});