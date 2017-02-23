var api_v1 = require('express').Router();

api_v1.use('/search', require('./search'));

// catch all
api_v1.use(function(req, res, next) {
	res.send('ParrotPlay API v1');
});

module.exports = api_v1;
