let cardApp = {

	displayIndex: function(data) {
		let title = data[0].title;
		let elm_UL = document.createElement('ul');
		let elm_li = document.createElement('li');
		elm_UL.appendChild(elm_li);
		elm_li.innerHTML = title;
		document.getElementById('main').appendChild(elm_UL);

		//elm.innerHTML = data[0].title;
	},

	displayError: function(errMsg) {
		let elm = document.getElementById('main');
		elm.innerHTML = errMsg;
	},

	fetchData: function(url) {
	  fetch(url)
	  	.then((result) => result.json())
	  		.then((data) => this.displayIndex(data))
	    .catch((err) => this.displayError(err));
	},

	getDataButton: function() {
		const url = 'http://localhost:3000/cards';
		this.fetchData(url);
	}

}
