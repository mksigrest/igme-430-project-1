const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const style = path.join(__dirname, '..', 'client', 'client.css');
const html = path.join(__dirname, '..', 'client', 'client.html');
const json = path.join(__dirname, '..', 'jsonFile', 'countries.json');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;



server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})