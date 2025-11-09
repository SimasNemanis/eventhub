export const config = {
  api: {
    bodyParser: false,  // Disable automatic parsing
  },
};

export default async function handler(req, res) {
  const BACKEND_URL = 'http://46.224.28.13:5000/api';
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true' );
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const { path = '' } = req.query;
    const pathString = Array.isArray(path) ? path.join('/') : path;
    const targetUrl = `${BACKEND_URL}/${pathString}`;
    
    // Manually read and parse the body
    let body = '';
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        });
        req.on('end', () => {
          resolve(data);
        });
      });
    }
    
    console.log('Raw body:', body);
    console.log('Proxying to:', targetUrl);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    
    const options = {
      method: req.method,
      headers: headers,
    };
    
    if (body) {
      options.body = body;  // Send raw body as-is
    }
    
    console.log('Sending to backend:', body);
    
    const response = await fetch(targetUrl, options);
    const data = await response.json();
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
}
