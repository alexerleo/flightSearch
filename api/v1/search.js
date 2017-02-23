var router = require('express').Router(),
	helper = require('../../helpers/search');

router.get('/airlines', function(req,res){
	helper.airlines(function(status, response, error){
		res.status(status).json(error || response);
	});
});
router.get('/airports', function(req,res){
	helper.airports(req.query.q, function(status, response, error){
		res.status(status).json(error || response);
	});
});
router.get('/search', function(req,res){
	helper.search(req.query.from, req.query.to, req.query.date, function(status, response, error){
		res.status(status).json(error || response);
	});
});

module.exports = router;
