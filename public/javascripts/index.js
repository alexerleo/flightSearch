var component = {
	airlines: null,
	activeTab: null,
	search(from, to, date){
		this.clear();
		$('.alert-info').removeClass('hide');
		Service.search(from, to, date).then((result)=>{
			this.airlines = result;
			this.renderTabs();
		});
	},
	getAirlines(date){
		return this.airlines[date];
	},
	renderTabs(){
		$('.alert-info,.alert-warning,.alert-danger').addClass('hide');
		Object.keys(this.airlines).sort().forEach((key, index)=>{
			$('#tabs').append(`
				<li role="presentation" class="${index == 2 ? 'active' : ''}">
					<a href="#">${key}</a>
				</li>
			`);
			if(index == 2)
				this.renderTab(key);
		});
		$('#tabs, #content-tab').removeClass('hide');
	},
	renderTab(date){
		$('tbody').html('');
		this.activeTab = date;
		let data = this.getAirlines(date);
		data.forEach(function(item, i){
			$('tbody').append(`
				<tr>
					<th scope="row">${i + 1}</th>
					<td>${item.airline.name}</td>
					<td>${$.datepicker.formatDate('yy-mm-dd', new Date(item.start.dateTime))}</td>
					<td>${Math.round((item.durationMin / 60 )).toFixed(1)} hr</td>
					<td>${$.datepicker.formatDate('yy-mm-dd', new Date(item.finish.dateTime))}</td>
					<td>${item.start.cityName} (${item.start.airportName}) - ${item.finish.cityName} (${item.finish.airportName})</td>
					<td>${item.price}</td>
					<td>${item.plane.shortName}</td>
				</tr>
			`);
		});
	},
	clear(){
		this.airlines = null;
		this.activeTab = null;
		$('tbody').html('');
		$('#tabs').html('');
	}
};

$(function() {
	$( "#datepicker" ).datepicker({
		dateFormat: "yy-mm-dd"
	});

	$('#tabs').click(function(e){
		$('#tabs > li').removeClass('active');
		$(e.target.parentElement).addClass('active');

		component.renderTab(e.target.innerText);
	});

	$('#searchForm').submit(function (event) {
		event.preventDefault();
		var from = $('#fromLocation')[0].value,
			to = $('#toLocation')[0].value,
			date = $("#datepicker")[0].value;
		if(!(from && to && date)){
			$('#error').removeClass('hide');
			return false;
		}
		component.search(from, to, date);
	})
});