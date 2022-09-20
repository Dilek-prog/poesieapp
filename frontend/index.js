const express = require('express');
var { createProxyMiddleware } = require('http-proxy-middleware');

const app = express()
const PORT = 8080;
const HOST = '0.0.0.0';
const BACKEND = 'http://backend:3000/'

app.use(express.static('public'))

app.use(createProxyMiddleware('/api/', {
    target: BACKEND,
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
    pathRewrite: {
        [`^/api`]: '',
    },
    }));

// Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Server at ${HOST}:${PORT}`);
 });