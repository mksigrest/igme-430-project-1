//functions called in server.js
const http = require('http');
const url = require('url');
const fs = require('fs');
//base function returning status codes and objects
const resJSON = (response, statusCode, object) => {
    const body = JSON.stringify(object);
    response.writeHead(statusCode, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
    response.end(body);
}
//function for POST endpoints that parses either JSON or x-www-form-urlencoded, and passed the body
const parseBody = (response, request, countries, callBack) => {
    let rawBody = '';
    request.on('data', chunk => { rawBody += chunk; });
    request.on('end', () => {
        const contentType = request.headers['content-type'] || '';
        let body;
        //if json format, parse body
        if (contentType.includes('application/json')) {
            try {
                body = JSON.parse(rawBody || '{}');
            }
            catch (err) {
                resJSON(response, 400, { error: 'Invalid JSON', id: 'badRequest' });
                return;
            }
        }
        //if www-urlencoded, use params into body
        else if (contentType.includes('application/x-www-form-urlencoded')) {
            const params = new URLSearchParams(rawBody);
            body = Object.fromEntries(params);
        }
        //else, empty body
        else {
            body = {};
        }
        //pass body
        callBack(body);
    })
}
//mainReqReturns status, type and length, based on Get or head, as well as responding with data
const mainReq = (response, request, conType, fileType) => {
    const data = fs.readFileSync(fileType);
    if (request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': conType, 'Content-Length': Buffer.byteLength(data) });
        response.end(data);
    }
    else if (request.method === 'HEAD') {
        response.writeHead(204, { 'Content-Type': conType, 'Content-Length': 0 });
        response.end();
    }
}
//function for HEAD and GET endpoints, filters and responds based on GET or HEAD and filter type
const getHeadReq = (response, request, parsedUrl, countries) => {
    const { name, region, capital } = parsedUrl.query;
    const resultsF = countries.filter((c) => {
        let retFilt = true;
        if (name) {retFilt = retFilt && c.name && c.name.toLowerCase().includes(name.toLowerCase().trim());}
        if (region) {retFilt = retFilt && c.region && c.region.toLowerCase().includes(region.toLowerCase().trim());}
        if (capital) {retFilt = retFilt && c.capital && c.capital.toLowerCase().includes(capital.toLowerCase().trim());}
        return retFilt
    });
    const err = JSON.stringify({ error: 'No matching countries found.', id: 'notFound' });
    if (request.method === 'GET') {
        if (resultsF.length === 0) {
            response.writeHead(404, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(err),
            });
            response.end(err);
        }
        else {
            const body = JSON.stringify(resultsF);
            response.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            });
            response.end(body);
        }
    }
    else {
        if (resultsF.length === 0) {
            response.writeHead(404, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(err),
            });
            response.end();
        }
        else {
            response.writeHead(204, {
                'Content-Type': 'application/json',
                'Content-Length': 0
            });
            response.end();
        }
    }
}
//function returns all countries in list
const allReq = (response, request, countries) => {
    if (request.method === 'GET') {
        const body = JSON.stringify(countries);
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        });
        response.end(body);
    }
    else {
        response.writeHead(204, {
            'Content-Type': 'application/json',
            'Content-Length': 0
        });
        response.end();
    }
}
//function for add POST endpoint
const addReq = (response, request, countries, body) => {
    const { name, capital } = body;
    const nameE = countries.find((c) => c.name && c.name.toLowerCase() === String(name).toLowerCase());
    const capitalE = countries.find((c) => c.capital && c.capital.toLowerCase() === String(capital).toLowerCase());
    //if name or capital exists, resJSON error 400 badRequest
    if (nameE || capitalE) {
        resJSON(response, 400, { error: 'Country/Capital already exists.', id: 'badRequest'});
        return;
    }
    //sets newCountry to later pass into array
    const newCountry = {
        name: String(body.name),
        capital: String(body.capital),
        longitude: body.longitude,
        latitude: body.latitude,
    };
    //pushes new country into countries array
    countries.push(newCountry);
    resJSON(response, 201, newCountry);
}
//function for edit POST endpoint
const editReq = (response, request, countries, body) => {
    const { name, capital, newCapital } = body;
    //finds country based of name or capital exist, as well as inputtable newCapital
    let country;
    if (name) { country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());}
    if (!country && capital) {country = countries.find((c) => c.capital.toLowerCase() === capital.toLowerCase());}
    if (!country) {
        resJSON(response, 404, { error: 'Country not found.', id:'notFound' });
        return;
    }
    //updates country found capital with newCapital
    country.capital = String(body.newCapital);
    //responds with status
    resJSON(response, 200, country);
}
//exports all modules to server.js
module.exports = { resJSON, parseBody, mainReq, getHeadReq, allReq, addReq, editReq };