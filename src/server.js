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
        response.writeHead(200, { 'Content-Type': 'text/html' });

        if (request.method === 'GET') {
            response.end(fs.readFileSync(html));
        }
        else if (request.method === 'HEAD') {
            response.end();
        }
    }

    else if ((request.method === 'GET' || request.method === 'HEAD') && (pathName === '/client.css')) {
        response.writeHead(200, { 'Content-Type': 'text/css' });

        if (request.method === 'GET') {
            response.end(fs.readFileSync(style));
        }
        else if (request.method === 'HEAD') {
            response.end();
        }
    }

    else if (request.method === 'GET' || request.method === 'HEAD') {
        if (pathName === '/api/getCountryName') {
            const { region, capital } = parsedUrl.query;
            const results = countries.filter((c) => {
                let retFilt;
                if (region) {
                    retFilt = c.region;
                }
                if (capital) {
                    retFilt = retFilt && c.capital;
                }
                resJSON(response, 200, retFilt);
            });
        }
        else if (pathName === '/api/getCountryLocation') {

        }
        else if (pathName === '/api/getCountryFinance') {

        }
        else if (pathName === '/api/getAllCountries') {
            resJSON(response, 200, results);
        }
    }

    else if (request.method === 'POST') {
        if (pathName === '/api/addCountry') {

        }
        else if (pathName === '/api/editCapital') {

        }
    }

    else {
        resJSON(response, 404, { message: 'The page you are looking for was not found.', id: 'notFound' });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})