const http = require('http');
const url = require('url');
const fs = require('fs');

const resJSON = (response, statusCode, object) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(object));
}

const mainReq = (response, request, conType, fileType) => {
    response.writeHead(200, { 'Content-Type': conType });

    if (request.method === 'GET') {
        response.end(fs.readFileSync(fileType));
    }
    else if (request.method === 'HEAD') {
        response.end();
    }
}

const getHeadReq = (response, parsedUrl, countries) => {
    const { name, region, capital } = parsedUrl.query;
    const resultsF = countries.filter((c) => {
        let retFilt = true;
        if (name) {
            retFilt = retFilt && c.name && c.name.toLowerCase().includes(name.toLowerCase().trim());
        }
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

const addReq = (response, request, countries) => {
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

const editReq = (response, request, countries) => {
    let rawBody = '';
    request.on('data', chunk => {
        rawBody += chunk;
    })

    request.on('end', () => {
        const body = JSON.parse(rawBody);
        const { name, capital, newCapital } = body;

        let country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
        if (!country) {
            country = countries.find((c) => c.capital.toLowerCase() === capital.toLowerCase());
        }
        console.log(body.capital);
        country.capital = String(body.newCapital);
        console.log(country.capital)
        resJSON(response, 200, country);
    })
}

module.exports = { resJSON, mainReq, getHeadReq, addReq, editReq };