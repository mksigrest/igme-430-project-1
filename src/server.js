const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const func = require('./functions.js');

const style = path.join(__dirname, '..', 'client', 'client.css');
const html = path.join(__dirname, '..', 'client', 'client.html');
const utils = path.join(__dirname, 'utils.js');
const json = path.join(__dirname, '..', 'jsonFile', 'countries.json');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

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

    if ((request.method === 'GET' || request.method === 'HEAD') && (pathName === '/' || pathName === '/client.html')) {
        func.mainReq(response, request, 'text/html', html);
    }

    else if ((request.method === 'GET' || request.method === 'HEAD') && (pathName === '/client.css')) {
        func.mainReq(response, request, 'text/css', style);
    }

    else if ((request.method === 'GET' || request.method === 'HEAD') && (pathName === '/utils.js')) {
        func.mainReq(response, request, 'application/javascript', utils);
    }

    else if (request.method === 'GET' || request.method === 'HEAD') {
        let results = countries.slice();

        if (pathName === '/api/getCountryName') {
            func.getHeadReq(response, request, parsedUrl, countries);
        }
        else if (pathName === '/api/getCountryLocation') {
            func.getHeadReq(response, request, parsedUrl, countries);
        }
        else if (pathName === '/api/getCountryFinance') {
            func.getHeadReq(response, request, parsedUrl, countries);
        }
        else if (pathName === '/api/getAllCountries') {
            func.resJSON(response, 200, results);
        }
    }
    
    else if (request.method === 'POST') {
        if (pathName === '/api/addCountry') {
            func.addReq(response, request, countries);
        }
        
        else if (pathName === '/api/editCapital') {
            func.editReq(response, request, countries);
        }
    }
    
    else {
        func.resJSON(response, 404, { message: 'The page you are looking for was not found.', id: 'notFound' });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})