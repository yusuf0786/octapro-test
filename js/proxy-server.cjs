const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({});

// Define the target URL to forward requests to
const targetUrl = 'http://octaprosolution.com';

// Create a server to handle incoming requests
const server = http.createServer((req, res) => {
    // Proxy the request to the target URL
    proxy.web(req, res, { target: targetUrl });
});

// Listen for requests on port 1000
const port = 1000;
server.listen(port, () => {
    console.log(`Proxy server is running on port ${port}`);
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Proxy error occurred.');
});
