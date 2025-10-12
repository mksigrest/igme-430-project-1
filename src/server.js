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
        let results = countries.slice();

        if (pathName === '/api/getCountryName') {
            const { region, capital } = parsedUrl.query;
            const resultsF = countries.filter((c) => {
                let retFilt = true;
                if (region) {
                    retFilt = retFilt && c.region && c.region.toLowerCase().includes(region.toLowerCase().trim());
                }
                if (capital) {
                    retFilt = retFilt && c.capital && c.capital.toLowerCase().includes(capital.toLowerCase().trim());
                }
                return retFilt
            });
            resJSON(response, 200, resultsF);
        }
        else if (pathName === '/api/getCountryLocation') {
            const { name, capital } = parsedUrl.query;
            const resultsF = countries.filter((c) => {
                let retFilt = true;
                if (name) {
                    retFilt = retFilt && c.name && c.name.toLowerCase().includes(name.toLowerCase().trim());
                }
                if (capital) {
                    retFilt = retFilt && c.capital && c.capital.toLowerCase().includes(capital.toLowerCase().trim());
                }
                return retFilt
            });
            resJSON(response, 200, resultsF);
        }
        else if (pathName === '/api/getCountryFinance') {
            const { name, capital } = parsedUrl.query;
            const resultsF = countries.filter((c) => {
                let retFilt = true;
                if (name) {
                    retFilt = retFilt && c.name && c.name.toLowerCase().includes(name.toLowerCase().trim());
                }
                if (capital) {
                    retFilt = retFilt && c.capital && c.capital.toLowerCase().includes(capital.toLowerCase().trim());
                }
                return retFilt
            });
            resJSON(response, 200, resultsF);
        }
        else if (pathName === '/api/getAllCountries') {
            resJSON(response, 200, results);
        }
    }
    
    else if (request.method === 'POST') {
        if (pathName === '/api/addCountry') {
            let rawBody = '';
            request.on('data', chunk => {
                rawBody += chunk;
            });

            request.on('end', () => {
                console.log('Raw body: ', rawBody);
                const body = JSON.parse(rawBody);
                console.log('Parsed body: ', body);
                const { name, capital } = body;
                const nameE = countries.find((c) => c.name.toLowerCase() === String(name).toLowerCase());
                const capitalE = countries.find((c) => c.capital.toLowerCase() === String(capital).toLowerCase());

                if (nameE || capitalE) {
                    resJSON(response, 400, 'Country/Capital already exists');
                    return;
                }

                const newCountry = {
                    name: String(body.name),
                    capital: String(body.capital),
                    longitude: body.longitude,
                    latitude: body.latitude,
                };

                countries.push(newCountry);
                resJSON(response, 201, newCountry);
            });
        }
        
        else if (pathName === '/api/editCapital') {
            let rawBody = '';
            request.on('data', chunk => {
                rawBody += chunk;
            })

            request.on('end', () => {
                const body = JSON.parse(rawBody);
                const { name, capital, newCapital } = body;
                const nameE = countries.find((c) => c.name.toLowerCase() === String(name).toLowerCase());
                const capitalE = countries.find((c) => c.capital.toLowerCase() === String(capital).toLowerCase());

                if (nameE || capitalE) {
                    resJSON(response, 400, 'Country/Capital already exists');
                    return;
                }

                const country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
                country.capital = String(body.capital);
                resJSON(response, 200, country);
            })
        }
    }
    
    else {
        resJSON(response, 404, { message: 'The page you are looking for was not found.', id: 'notFound' });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})