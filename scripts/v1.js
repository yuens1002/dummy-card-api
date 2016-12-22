let deck = {

	cards: [],
	Card: class {
		constructor(title, text, author) {
			this.id = undefined;
			this.title = title;
			this.text = text;
			this.author = author;
			this.picUrl = 'http://lorempixel.com/300/150/';
		}
	},
	saveCards: function(arrOfCards) {
		arrOfCards.forEach((card) => this.cards.push(card));
	},
	showCards: function() {
		console.log(this.cards);
	},
	addCard: function(title, text, author, picUrl) {
		this.cards.unshift(new this.Card(title, text, author));
		this.showCards();
	},
	editCard: function(position, title, text, author) {
		this.cards[position].title = title;
		this.cards[position].text = text;
		this.cards[position].author = author;
		this.showCards();
	},
	deleteCard: function(position) {
		this.cards.splice(position, 1);
		this.showCards();
	},
	fetchCards: function() {
	  const url = 'http://localhost:3000/cards';
	  fetch(url)
	  	.then((result) => result.json())
	  		.then((data) => this.saveCards(data))
	    .catch((err) => console.log(err));
	}
};

deck.fetchCards();
