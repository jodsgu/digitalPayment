const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')
const app = express();
const dbConnection = require('./db');
const Urlmaping = require('./api/models/urlmapings')
const mapLoginFormToApi = require('./api/library/loginFieldMapping');
//router
const userRouter = require('./api/routes/user');

app.use(cors());
dbConnection();


// Use express.json() middleware conditionally
app.use((req, res, next) => {
  if (req.path.startsWith('/users')) {
    // Only use express.json() for requests with '/users' in the path
    express.json()(req, res, next);
  } else {
    next();
  }
});


// Use express.json() middleware conditionally for '/login' path
app.use('/login', express.json());

// Fetch all mappings from the MongoDB collection
const fetchMappings = async () => {
  try {
    return await Urlmaping.find({});
  } catch (error) {
    console.error("Error fetching mappings:", error);
    return [];
  }
};



// Define a custom proxy middleware for each mapping  //this okk
const createProxyForMapping = async () => {
  const mappings = await fetchMappings();

 

  mappings.forEach(({ path, action_url }) => {
    let pathRewrite;
    if(path === '/login'){
      // Map form fields to API fields for '/login'
      pathRewrite = async (originalPath, req) => {
        try {
          console.log("222",req.body)
          const apiRequest = await mapLoginFormToApi(req.body);
          // Log the mapped API request (for debugging purposes)
          console.log('Mapped API Request:', apiRequest);
          console.log("new path",action_url);
          return action_url;
         
        } catch (error) {
          console.error("Error mapping form to API for '/login':", error);
          throw error; // Propagate the error
        }
      };
    }
    else if (path.startsWith('/user-details/')) {
      pathRewrite = (originalPath, req) => {
        // Extract the dynamic user_id from the path
        const user_id = req.params.user_id;
        const modifiedActionUrl = action_url.replace(':user_id', user_id);
        return originalPath.replace(`/user-details/${user_id}`, modifiedActionUrl);
      };
      
    }
    else if (path === '/role-maps') {
      pathRewrite = (originalPath, req) => {
        // Handle dynamic query parameters for '/roleMaps' here
        const queryParams = {
          action: req.query.action || 'default',
          'filter-user-id': req.query['filter-user-id'] || 'default',
        };
        
        const queryString = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
       //console.log("Redirecting to:", `${action_url}?${queryString}`);
        return `${action_url}?${queryString}`;
      };
    }
    

    app.use(path, createProxyMiddleware({
      target: 'http://10.0.253.185',
      changeOrigin: true,
      pathRewrite,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      }
    }));
  });
};

// Create proxy middleware for each mapping
createProxyForMapping();
//all end point list
app.use('/users',userRouter);



// Start the server
const port = 3000; // or any other port you prefer
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});