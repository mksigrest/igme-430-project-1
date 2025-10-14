//requiring for code to work
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const func = require('./functions.js');
//file path reads
const style = path.join(__dirname, '..', 'client', 'client.css');
const html = path.join(__dirname, '..', 'client', 'client.html');
const utils = path.join(__dirname, 'utils.js');
const json = path.join(__dirname, '..', 'jsonFile', 'countries.json');
const docu = path.join(__dirname, '..', 'client', 'documentation.html');
//Port to run through
const PORT = process.env.PORT || process.env.NODE_PORT || 3000;
//loads .json from startup into countries array
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
//created server pathing, runs through port
const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathName = parsedUrl.pathname;
    //If base path, load main page
    if ((request.method === 'GET' || request.method === 'HEAD') && (pathName === '/' || pathName === '/client.html')) {
        func.mainReq(response, request, 'text/html', html);
        return;
    }
    if ((request.method === 'GET' || request.method === 'HEAD') && (pathName === '/documentation.html')) {
        func.mainReq(response, request, 'text/html', docu);
        return;
    }
    //loads .css file
    else if ((request.method === 'GET' || request.method === 'HEAD') && (pathName === '/client.css')) {
        func.mainReq(response, request, 'text/css', style);
        return;
    }
    //loads .html script file utils
    else if ((request.method === 'GET' || request.method === 'HEAD') && (pathName === '/utils.js')) {
        func.mainReq(response, request, 'application/javascript', utils);
        return;
    }
    //specific path or GET and HEAD requests
    else if (request.method === 'GET' || request.method === 'HEAD') {
        let results = countries.slice();
        //returns name from either reigon or capital
        if (pathName === '/api/getCountryName') {
            func.getHeadReq(response, request, parsedUrl, countries);
            return;
        }
        //returns country location
        else if (pathName === '/api/getCountryLocation') {
            func.getHeadReq(response, request, parsedUrl, countries);
            return;
        }
        //returns country financial information
        else if (pathName === '/api/getCountryFinance') {
            func.getHeadReq(response, request, parsedUrl, countries);
            return;
        }
        //returns all countries as .json format
        else if (pathName === '/api/getAllCountries') {
            func.allReq(response, request, countries);
            return;
        }
        //returns error 404 if not found
        else {
            func.resJSON(response, 404, { message: 'The page you are looking for was not found.', id: 'notFound' });
        }
    }
    //specific pathing for POST
    else if (request.method === 'POST') {
        //pathing for add a country
        if (pathName === '/api/addCountry') {
            func.parseBody(response, request, countries, (body) => {
                func.addReq(response, request, countries, body);
            })
            return;
        }
        //pathing for editing a capital for a country
        else if (pathName === '/api/editCapital') {
            func.parseBody(response, request, countries, (body) => {
                func.editReq(response, request, countries, body);
            })
            return;
        }
    }
    //returns error 404 if not found
    else {
        func.resJSON(response, 404, { message: 'The page you are looking for was not found.', id: 'notFound' });
    }
});
//runs server function through port
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})