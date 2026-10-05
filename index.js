const https = require('https');

module.exports = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const options = {
      hostname: 'v.whatsapp.net',
      port: 443,
      path: '/v2/exist',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': req.headers['user-agent'] || 'WhatsApp/2.23.24.76',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(proxyRes.statusCode).send(data);
      });
    });

    proxyReq.on('error', (e) => {
      res.status(500).json({ error: e.message });
    });

    proxyReq.write(body);
    proxyReq.end();
  });
};
