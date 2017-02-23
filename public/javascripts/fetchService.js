var fetchService = {
	baseURL: "/api/v1/",
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