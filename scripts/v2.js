let deck = {

	cards: [],
	cardsPerPage: 3,
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
		arrOfCards.forEach((card) => this.cards.push(card));
	},
	getNumPages: function() {
		return Math.ceil(this.cards.length / this.cardsPerPage);
	},
	showCards: function(page) {
		for (var i = (page - 1) * this.cardsPerPage; i < (page * this.cardsPerPage); i++) {
    		if (this.cards[i]) console.log(this.cards[i]);
		}
		console.log('Page ' + page + ' of ' + this.getNumPages());
		if (page >= 1 && page < this.getNumPages()) console.log ('next');
		if (page > 1) console.log ('prev');
	},
	addCard: function(title, text, author, picUrl) {
		this.cards.unshift(new this.Card(title, text, author));
		this.showCards(1);
	},
	editCard: function(position, title, text, author) {
		this.cards[position].title = title;
		this.cards[position].text = text;
		this.cards[position].author = author;
		this.showCards(1);
	},
	deleteCard: function(position) {
		this.cards.splice(position, 1);
		this.showCards(1);
	},
	fetchCards: function() {
	  const BaseUrl = 'http://localhost:3000/cards';
	  const cards99 = '?_page=1&_limit=99';
	  let curl = BaseUrl + cards99;

// research server-side pagination using header Link
//	  fetch(curl)
//	  	.then((result) => (result.headers.get('Link')))
//	    .catch((err) => console.log(err));
	  fetch(curl)
	  	.then((result) => result.json())
	  		.then((data) => this.saveCards(data))
	        .then(() => this.showCards(1))
	    .catch((err) => console.log(err));

	}
};

deck.fetchCards();
