let deck = {

	cards: [],
	cardsPerPage: 3,
	currentPage: 1,
	Card: class {
		constructor(title, text, author) {
			this.id = this.getNextId;
			this.title = title;
			this.text = text;
			this.author = author;
			this.picUrl = 'http://lorempixel.com/300/150/';
		}
		get getNextId() {
			let id = [];
			return (Math.max(...(deck.cards.map((card, i) => id[i] = card.id))))+1;
		}
	},
	saveCards: function(arrOfCards) {
		arrOfCards.forEach((card, i) => this.cards[i] = card);
	},
	getNumPages: function() {
		return Math.ceil(this.cards.length / this.cardsPerPage);
	},
	showCards: function(page) {
		this.currentPage = page;
		for (var i = (page - 1) * this.cardsPerPage; i < (page * this.cardsPerPage); i++) {
    		if (this.cards[i]) console.log(this.cards[i]);
		}
		console.log('Page ' + page + ' of ' + this.getNumPages());
		if (page >= 1 && page < this.getNumPages()) console.log ('next');
		if (page > 1) console.log ('prev');
	},
	addCard: function(title, text, author) {
		//this.cards.unshift(new this.Card(title, text, author));
		this.saveCardToDb(title, text, author);
	},
	editCard: function(id, title, text, author) {
		this.saveEditedCardToDb(id, title, text, author);
	},
	deleteCard: function(id) {
		this.delCardFromDb(id);
	},
	delCardFromDb: function(id) {
		const BaseUrl = 'http://localhost:3000/cards';
		let curl = BaseUrl+ '/' + id
		fetch(curl, {
			method: 'DELETE'
		}).then(() => this.fetchCards())
	    .catch((err) => console.log(err));
	},
	saveEditedCardToDb: function(id, title, text, author) {
		const BaseUrl = 'http://localhost:3000/cards';
		let curl = BaseUrl+ '/' + id
		fetch(curl, {
			method: 'PATCH',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				title: title,
				text: text,
				author: author
			})
		}).then(() => this.fetchCards())
	    .catch((err) => console.log(err));
	},
	saveCardToDb: function(title, text, author) {
		const BaseUrl = 'http://localhost:3000/cards';
		const picUrl = 'http://lorempixel.com/300/150/';
		this.currentPage = 1;
		fetch(BaseUrl, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				title: title,
				text: text,
				author: author,
				image_url: picUrl
			})
		}).then(() => this.fetchCards())
	    .catch((err) => console.log(err));
	},
	fetchCards: function() {
	  	const BaseUrl = 'http://localhost:3000/cards';
	  	const cards99 = '?_page=1&_limit=99&_sort=id&_order=DESC';
	  	const curl = BaseUrl + cards99;

// research server-side pagination using header Link
//	  fetch(curl)
//	  	.then((result) => (result.headers.get('Link')))
//	    .catch((err) => console.log(err));
	  	fetch(curl)
	  		.then((result) => result.json())
	  			.then((data) => this.saveCards(data))
	        	.then(() => this.showCards(this.currentPage))
	    .catch((err) => console.log(err));

	}
};

deck.fetchCards();
