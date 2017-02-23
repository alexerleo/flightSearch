const request = require('request'),
	async = require('async'),
	moment = require('moment');
var helper = {
	baseUrl: 'http://node.locomote.com/code-task',
	redirect(options, callback){
		options.url = this.baseUrl + options.url;
		request(options, function(error, response, body){
			var result = body;
			try {
				result = JSON.parse(result);
			}
			catch(err){
				var a = true;
			}
			callback(response.statusCode, result, error);
		});
	},
	airlines(callback){
		this.redirect({
			url:'/airlines'
		}, callback);
	},
	airports(query, callback){
		this.redirect({
			url:`/airports?q=${query}`
		}, callback);
	},
	singleSearch(from, to, date, airline, callback){
		this.redirect({
			url:`/flight_search/${airline}?date=${date}&from=${from}&to=${to}`
		}, callback);
	},
	search(from, to, date, callback){
		var self = this;
		var dates = [0,1,2,3,4].map(function(index){
			var d = new Date(date);
			d = new Date(d.setDate(d.getDate() - index + 2));
			return moment(d).format('YYYY-MM-DD');
		});

		var result = {};
		this.airlines(function(status, response, error){
			if(error || !response)
				return callback(status, response, error);
			var airlinesSearch = response.map(function(airline){
				return function(done) {
					var dateSearch = dates.map(function(date) {
						return function(done) {
							self.singleSearch(from, to, date, airline.code, function (status, response, error) {
								if(error || !response)
									return done(error);
								if(!result[date])
									result[date] = [];
								Array.prototype.push.apply(result[date], response);
								done();
							});
						}
					});
					async.parallel(dateSearch, done);
				}
			});
			async.parallel(airlinesSearch, function(){
				callback(200, result, null);
			});
		})
	}
};

module.exports = helper;