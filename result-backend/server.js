const http = require('http');
const url = require('url');
const fs = require('fs');

// Example in-memory data storage (replace with your own data management logic)
let students = [
  { rollNo: '1', name: 'Alice', marks: 85 },
  { rollNo: '2', name: 'Bob', marks: 78 },
];

// Server setup
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Handle API requests
  if (req.method === 'GET' && parsedUrl.pathname === '/api/students') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
  } else if (req.method === 'POST' && parsedUrl.pathname === '/api/students') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      const newStudent = JSON.parse(body);
      students.push(newStudent);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newStudent));
    });
  } else {
    // Serve static files (Angular frontend)
    if (req.url === '/') {
      fs.readFile('index.html', (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('File not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else {
      // Serve other static files (CSS, JavaScript, etc.)
      fs.readFile('.' + req.url, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('File not found');
        } else {
          let contentType = 'text/html';
          if (req.url.endsWith('.css')) {
            contentType = 'text/css';
          } else if (req.url.endsWith('.js')) {
            contentType = 'application/javascript';
          }
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    }
  }
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
