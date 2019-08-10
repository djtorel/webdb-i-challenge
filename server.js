const express = require('express');

const accountRoutes = require('./routes/accounts');

const server = express();

server.use(express.json());

server.use('/api/accounts', accountRoutes);

module.exports = server;
