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
	deleteCard: function(id,idx) {
		this.cards.splice(idx, 1);
		this.delCardFromDb(id);
	},
	delCardFromDb: function(id) {
		const BaseUrl = 'http://localhost:3000/cards';
		let curl = BaseUrl+ '/' + id
		fetch(curl, {
			method: 'DELETE'
		}).then(() => view.showPage(view.currentPage))
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

let handlers = {
	addCard: function() {

	},
	editCard: function(idx) {
		let node = document.getElementById(idx).children[1];
		let eleActions = node.children[0];
		let eleTitle = node.children[1];
		let eleText = node.children[2];
		view.showEditInputs(node, eleActions, eleTitle, eleText);
	},
	deleteCard: function(idx) {
		let cardId = deck.cards[idx].id;
		deck.deleteCard(cardId, idx);
	},
	prevPage: function() {
		view.showPage(view.currentPage-1);
	},
	nextPage: function() {
		view.showPage(view.currentPage+1);
	},
	cancel: function(idx) {
		let divElm = document.getElementById('main')
		divElm.replaceChild(view.makeCard(idx, 'editDel'), document.getElementById(idx));
	}
};

let view = {
	cardsPerPage: 3,
	currentPage: 1,
	appTitleText: 'Card Demo',
	makeCard: function(idx, actionGroup) {
		let eleChild = document.createElement('div');
		eleChild.setAttribute('class', 'child');
		eleChild.setAttribute('id', idx);
		let eleImg = document.createElement('div');
		let eleSrc = document.createElement('img');
		eleSrc.setAttribute('src', deck.cards[idx].image_url);
		let eleInnerChild = document.createElement('div');
		eleInnerChild.setAttribute('class', 'child-inner');
		let eleTitle = document.createElement('h3');
		eleTitle.innerHTML = deck.cards[idx].title;
		let eleText = document.createElement('p');
		eleText.innerHTML = deck.cards[idx].text;
		let eleAuthor = document.createElement('p');
		eleAuthor.setAttribute('class', 'author');
		eleAuthor.innerHTML = '- ' + deck.cards[idx].author;
		let eleLinkUl = document.createElement('ul');
		eleLinkUl.innerHTML = this.createCardActionLinks(actionGroup);
		eleImg.appendChild(eleSrc);
		eleInnerChild.appendChild(eleLinkUl);
		eleInnerChild.appendChild(eleTitle);
		eleInnerChild.appendChild(eleText);
		eleInnerChild.appendChild(eleAuthor);

		eleChild.appendChild(eleImg);
		eleChild.appendChild(eleInnerChild);

		return eleChild;

	},
	showPage: function(page) {
		this.currentPage = page;
		let eleMain = document.querySelector('#main');
		eleMain.innerHTML = '';
		this.showTitle();
		for (var i = (page - 1) * this.cardsPerPage; i < (page * this.cardsPerPage); i++) {
    		if (deck.cards[i]) {
				eleMain.appendChild(this.makeCard(i,'editDel'));
			}
		}
		this.showPageInfo(this.currentPage);
		this.showPrevLink(this.currentPage);
		this.showNextLink(this.currentPage);

	},
	createCardActionLinks: function(type) {
		let eleLinks = '';
		if (type === 'editDel') {
			eleLinks = '<li class="edit-links">✎ Edit</li><li class="delete-links">✕ Delete</li>';
		} else if (type === 'cancelSave') {
			eleLinks = '<li class="cancel-links">✕ Cancel</li><li class="save-links">✓ Save</li>';
		}
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
	},
	showEditInputs: function(node, eleActions, eleTitle, eleText) {

		let inputTitle = document.createElement('input');
		let areaText = document.createElement('textarea');

		inputTitle.value = node.children[1].innerHTML;
		inputTitle.size = 32;
		areaText.value = node.children[2].innerHTML;

		eleActions.innerHTML = this.createCardActionLinks('cancelSave');
		node.replaceChild(inputTitle, eleTitle);
		node.replaceChild(areaText, eleText);

	},
	setupEventListeners: function() {
		deck.fetchCards();
		let cardIdx = 0;
		let navElements = document.querySelector('nav');
		navElements.addEventListener('click', function(event) {
			let navElementClicked = event.target;
			if (navElementClicked.id === 'prev-link') {
				handlers.prevPage();
			} else if (navElementClicked.id === 'next-link') {
				handlers.nextPage();
			}
		});
		let cardElements = document.querySelector('#main');
		cardElements.addEventListener('click', function(event) {
			let cardElmClicked = event.target;
			if (cardElmClicked.className === 'delete-links') {
				cardIdx = cardElmClicked.parentNode.parentNode.parentNode.id;
				handlers.deleteCard(cardIdx);
			} else if (cardElmClicked.className === 'edit-links') {
				cardIdx = cardElmClicked.parentNode.parentNode.parentNode.id;
				handlers.editCard(cardIdx);
			} else if (cardElmClicked.className === 'cancel-links') {
				// if user clicks cancel, it should take the user back to original card
				// makeCard with the idx of the card
				// render it in the id div
				cardIdx = cardElmClicked.parentNode.parentNode.parentNode.id;
				handlers.cancel(cardIdx);
			} else if (cardElmClicked.className === 'save-links') {
				console.log('save clicked');
			}
		});
	}
};

view.setupEventListeners();

