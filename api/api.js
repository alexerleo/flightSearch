var api = require('express').Router();

/**
 * API V1
 */
var api_v1 = require('./v1/api_v1.js');

api.use('/v1', api_v1);

// catch all
api.use(function(req, res, next) {
	res.send('Flight API');
});

module.exports = api;