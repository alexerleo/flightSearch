var Service = {
	baseURL: "/api/v1/",
	prepareSearch(from,to,date){
		let mapped = {
			from,
			to,
			date
		};
		let promises = [
			this.mapCity(from).then((city)=>{
				mapped.from = city;
			}),
			this.mapCity(to).then((city)=>{
				mapped.to = city;
			}),
		];
		return Promise.all(promises).then(()=>{
			return mapped;
		});
	},
	search(from, to, date){
		return this.prepareSearch(from,to,date).then((response)=>{
			return this.fetch({
				url: `/search/search?from=${response.from}&to=${response.to}&date=${response.date}`,
				type: 'get'
			});
		});

	},
	mapCity(city){
		return this.fetch({
			url: `/search/airports?q=${city}`,
			type: 'get'
		})
			.then((response)=>{
				return response.map((e)=>{
					return e.airportCode;
				})[0];
			});
	},
	json(response){
		return response ? response.json().then((res)=>{
			return typeof(res) ==  'string' ? JSON.parse(res) : res;
		}) : null;
	},
	fetch(options){
		let data = jQuery.extend({}, options);
		delete data.url;
		return window.fetch(this.baseURL + options.url, data).then(this.status).then(this.json);
	},
	status(response){
		if (response.status >= 200 && response.status < 300)
			return Promise.resolve(response);
		if(response.status >= 500 || response.status >= 400)
			return Promise.reject();
		return response.text().then((text)=> {
			throw new Error(text);
		});
	}
};