const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const style = path.join(__dirname, '..', 'client', 'client.css');
const html = path.join(__dirname, '..', 'client', 'client.html');
const json = path.join(__dirname, '..', 'jsonFile', 'countries.json');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const resJSON = (response, statusCode, object) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(object));
}

const resTEXT = (response, statusCode, message) => {
    response.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    response.end(message);
}

let countries = [];
try {
    const rawJSON = fs.readFileSync(json, { encoding: 'utf8' });
    countries = JSON.parse(rawJSON);
    if (!Array.isArray(countries)) {
        console.error('Parsed data isnt array');
    }
}
catch (error) {
    console.error(`Failed to load country data from ${json}:`, error.message);
}

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathName = parsedUrl.pathname;

    if ((method === 'GET' || method === 'HEAD') && (pathName = '/' || pathname = '/client.html')) {

    }

    else if ((method === 'GET' || method === 'HEAD') && (pathName = '/client.css')) {

    }
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})