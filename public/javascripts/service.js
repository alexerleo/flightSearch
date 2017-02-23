var Service = {
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
			return fetchService.fetch({
				url: `/search/search?from=${response.from}&to=${response.to}&date=${response.date}`,
				type: 'get'
			});
		});
	},
	mapCity(city){
		return fetchService.fetch({
			url: `/search/airports?q=${city}`,
			type: 'get'
		})
			.then((response)=>{
				return response.map((e)=>{
					return e.airportCode;
				})[0];
			});
	},
};