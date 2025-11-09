export default async function handler(req, res) {
  const BACKEND_URL = 'http://46.224.28.13:5000/api';
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true' );
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Extract the path after /api/proxy
    const { path = '' } = req.query;
    const pathString = Array.isArray(path) ? path.join('/') : path;
    const targetUrl = `${BACKEND_URL}/${pathString}`;
    
    console.log('Proxying to:', targetUrl);
    console.log('Request body:', req.body);
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    
    // Prepare request options
    const options = {
      method: req.method,
      headers: headers,
    };
    
    // Add body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      // req.body is already parsed by Vercel, so we need to stringify it
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
    
    console.log('Sending to backend:', options.body);
    
    // Make request to backend
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
