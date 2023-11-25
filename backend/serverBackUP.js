const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')
const app = express();
const dbConnection = require('./db');
const Urlmaping = require('./api/models/urlmapings')
const User = require('./api/models/users')

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




// Fetch all mappings from the MongoDB collection
const fetchMappings = async () => {
  try {
    return await Urlmaping.find({});
  } catch (error) {
    console.error("Error fetching mappings:", error);
    return [];
  }
};

/* const getResult = async()=>{
  const result  = await fetchMappings();
  console.log(">>>>>>>>>>>>999.", result);
}

getResult(); */
/* // Define a custom proxy middleware for '/login' 
app.use('/login', createProxyMiddleware({
  target: 'http://10.0.253.185',
  changeOrigin: true,
  pathRewrite: {
    '^/login': '/api/v1/user-auth-tokens',
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));


// Define a custom proxy middleware for '/user-details/:user_id'
app.use('/user-details/:user_id', createProxyMiddleware({
  target: 'http://10.0.253.185',
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // Extract the dynamic user_id from the path
    const user_id = req.params.user_id;
    return path.replace(`/user-details/${user_id}`, `/api/v1/users/${user_id}`);
  },
 
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// Define a custom proxy middleware for '/role-maps' 
app.use('/role-maps', createProxyMiddleware({
  target: 'http://10.0.253.185',
  changeOrigin: true,
  pathRewrite: {
    '^/role-maps': '/api/v1/user-role-maps',
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));
 */

// Define a custom proxy middleware for each mapping  //this okk
const createProxyForMapping = async () => {
  const mappings = await fetchMappings();

 

  mappings.forEach(({ path, action_url }) => {
    let pathRewrite;
    if(path === '/login'){
      pathRewrite = {
        '^/login': action_url,
      };
    }
    else if (path.startsWith('/user-details/')) {
      pathRewrite = (originalPath, req) => {
        // Extract the dynamic user_id from the path
        const user_id = req.params.user_id;
        return originalPath.replace(`/user-details/${user_id}`, `/api/v1/users/${user_id}`);
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