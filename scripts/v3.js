let deck = {

	cards: [],
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
		return Math.ceil(this.cards.length / view.cardsPerPage);
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
		view.currentPage = 1;
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
	        	.then(() => view.showPage(view.currentPage))
	    .catch((err) => console.log(err));

	}
};

let listeners = {

};

let handlers = {
	editCard: function() {
		deck.editCard(id, title, text, author);
	},
	deleteCard: function() {
		deck.deleteCard(id);
	},
	prevPage: function() {

	},
	nextPage: function() {

	}
};

let view = {
	cardsPerPage: 3,
	currentPage: 1,
	appTitleText: 'Card Demo',
	showPage: function(page) {
		this.currentPage = page;
		let eleMain = document.querySelector('#main');
		eleMain.innerHTML = '';
		this.showTitle();
		for (var i = (page - 1) * this.cardsPerPage; i < (page * this.cardsPerPage); i++) {
    		if (deck.cards[i]) {
				let eleChild = document.createElement('div');
				eleChild.setAttribute('class', 'child');
				let eleImg = document.createElement('div');
				let eleSrc = document.createElement('img');
				eleSrc.setAttribute('src', deck.cards[i].image_url);
				let eleInnerChild = document.createElement('div');
				eleInnerChild.setAttribute('class', 'child-inner');
				let eleTitle = document.createElement('h3');
				eleTitle.innerHTML = deck.cards[i].title;
				let eleText = document.createElement('p');
				eleText.innerHTML = deck.cards[i].text;
				let eleAuthor = document.createElement('p');
				eleAuthor.setAttribute('class', 'author');
				eleAuthor.innerHTML = '- ' + deck.cards[i].author;
				let eleLinkUl = document.createElement('ul');
				eleLinkUl.innerHTML = this.createCardActionLinks();

				eleImg.appendChild(eleSrc);
				eleInnerChild.appendChild(eleLinkUl);
				eleInnerChild.appendChild(eleTitle);
				eleInnerChild.appendChild(eleText);
				eleInnerChild.appendChild(eleAuthor);

				eleChild.appendChild(eleImg);
				eleChild.appendChild(eleInnerChild);
				eleMain.appendChild(eleChild);
			}
		}

		this.showPageInfo(this.currentPage);
		this.showPrevLink(this.currentPage);
		this.showNextLink(this.currentPage);
	},
	createCardActionLinks: function() {
		let eleLinks = '<li class="edit-links">✎ Edit</li><li class="delete-links">✕ Delete</li>';
		return eleLinks;
	},
	showTitle: function() {
		let eleHeader = document.querySelector('header');
		eleHeader.innerHTML = this.appTitleText;
	},
	showPageInfo: function(page) {
		let pageInfo = document.querySelector('.page-info');
		pageInfo.innerHTML = 'Page ' + page + ' of ' + deck.getNumPages();
	},
	showPrevLink: function(page) {
		(page === 1) ?
			document.querySelector('#prev-link').style.visibility = "hidden" :
			document.querySelector('#prev-link').removeAttribute('style')

	},
	showNextLink: function(page) {
		(page === deck.getNumPages()) ?
			document.querySelector('#next-link').style.visibility = "hidden" :
			document.querySelector('#next-link').removeAttribute('style')
	}
};

deck.fetchCards();
