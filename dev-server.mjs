import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple .env parser
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = url.pathname;

  // Static files in /public
  if (pathname === '/') pathname = '/index.html';
  
  const publicPath = path.join(__dirname, 'public', pathname);
  
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    const ext = path.extname(publicPath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(publicPath).pipe(res);
    return;
  }

  // API Routes
  if (pathname.startsWith('/api/')) {
    const apiFile = path.join(__dirname, pathname + '.js');
    if (fs.existsSync(apiFile)) {
      try {
        const { default: handler } = await import(apiFile + '?t=' + Date.now());
        
        // Mock Vercel req/res
        const vercelReq = {
          method: req.method,
          body: await new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              try { resolve(JSON.parse(body)); } catch(e) { resolve({}); }
            });
          }),
          query: Object.fromEntries(url.searchParams)
        };

        const vercelRes = {
          status: (code) => {
            res.statusCode = code;
            return vercelRes;
          },
          json: (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return vercelRes;
          },
          setHeader: (name, value) => {
            res.setHeader(name, value);
            return vercelRes;
          },
          end: (data) => {
            res.end(data);
            return vercelRes;
          }
        };

        await handler(vercelReq, vercelRes);
        return;
      } catch (err) {
        console.error('API Error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
        return;
      }
    }
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n🚀 Flux Agency App running at http://localhost:${PORT}\n`);
});
