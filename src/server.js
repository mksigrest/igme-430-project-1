const http = require('http');
const url = require('url');

const style = path.join(__dirname, '..', 'client', 'client.css');
const html = path.join(__dirname, '..', 'client', 'client.html');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;