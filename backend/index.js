const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const port = 3000;




const proxy_filter = function (path, req) {
  return path.match('^/login') && (req.method === 'GET' || req.method === 'POST');
};

const proxy_options = {
  target: 'http://10.0.253.185',
  secure: false,
  pathRewrite: {
    '^/login': '/api/v1/user-auth-tokens', // Host path & target path conversion
  },
  onError(err, req, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('Something went wrong. And we are reporting a custom error message.' + err);
  },
  onProxyReq(proxyReq, req, res) {
    //console.log("mmmmmm----",req.body)

    if (req.method == 'POST' && req.body) {

      console.log("mmmmmm",req.body)


      // Add req.body logic here if needed....

      // ....

      // Remove body-parser body object from the request
      if (req.body) delete req.body;

      // Make any needed POST parameter changes
      let body = new Object();

      /* body.filename = 'reports/statistics/summary_2016.pdf';
      body.routeid = 's003b012d002';
      body.authid = 'bac02c1d-258a-4177-9da6-862580154960'; */
      body.login_name = 'alam@gmail.com';
      body.password = '123456';
      console.log(">>>>>>>>>>>>&&&&&&>>>>>>>>",body)
      // URI encode JSON object
      body = Object.keys(body).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
      }).join('&');

      // Update header
      proxyReq.setHeader('content-type', 'application/x-www-form-urlencoded');
      proxyReq.setHeader('content-length', body.length);

      // Write out body changes to the proxyReq stream
      proxyReq.write(body);
      proxyReq.end();
    }
  },
};

// Proxy configuration
const proxy = createProxyMiddleware(proxy_filter, proxy_options);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json({
    success: true,
    message: "all ok"
  });
});

router.all('/login', proxy);

// Mount the router on the app
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
