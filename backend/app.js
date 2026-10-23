// Vercel Express deployment entry point.
require('express');
module.exports = require('./src/app').app;
