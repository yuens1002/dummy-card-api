(function() {

let deck = {
	cards: [],
	Card: class {
		constructor(title, text, author) {
			this.id = this.nextId;
			this.title = title;
			this.text = text;
			this.author = author;
			this.image_url = 'http://placehold.it/300x150/6cd7f7/333333?text=Add+a+Card';
		}
		get nextId() {
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
	addCard: function(idx, title, text, author, isNew) {
		if (isNew) {
			this.cards.unshift(new this.Card(title, text, author));
		} else {
			this.cards[idx].title = title;
			this.cards[idx].text = text;
			this.cards[idx].author = author;
			this.cards[idx].image_url = 'http://lorempixel.com/300/150/';
			this.saveCardToDb(idx);
		}
	},
	editCard: function(id, title, text, idx) {
		this.cards[idx].title = title;
		this.cards[idx].text = text;
		this.saveEditedCardToDb(id, title, text, idx);
	},
	deleteCard: function(id, idx, isNew) {
		if (isNew) {
			this.cards.splice(idx, 1);
		} else {
			this.cards.splice(idx, 1);
			this.delCardFromDb(id);
		}
	},
	delCardFromDb: function(id) {
		const BaseUrl = 'http://localhost:3000/cards';
		let curl = BaseUrl+ '/' + id
		fetch(curl, {
			method: 'DELETE'
		}).then(() => view.showPage(view.currentPage))
	    .catch((err) => console.log(err));
	},
	saveEditedCardToDb: function(id, title, text, idx) {
		const BaseUrl = 'http://localhost:3000/cards';
		let curl = BaseUrl+ '/' + id
		fetch(curl, {
			method: 'PATCH',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				title: title,
				text: text
			})
		}).then(() => view.showCard(idx, 'editDel'))
	    .catch((err) => console.log(err));
	},
	saveCardToDb: function(idx) {
		const BaseUrl = 'http://localhost:3000/cards';
		const picUrl = 'http://lorempixel.com/300/150/';
		view.currentPage = 1;
		fetch(BaseUrl, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				title: this.cards[idx].title,
				text: this.cards[idx].text,
				author: this.cards[idx].author,
				image_url: picUrl
			})
		}).then(() => view.showCard(idx, 'editDel'))
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
	addCard: function(title, text, author) {
		deck.addCard(0, title, text, author, 1);
		view.showPage(1);
		this.editCard(0, 1);
	},
	editCard: function(idx, isNew) {
		let node = document.getElementById(idx).children[1];
		let eleActions = node.children[0];
		let eleTitle = node.children[1];
		let eleText = node.children[2];
		let eleAuthor = node.children[3];
		view.showEditInputs(node, eleActions, eleTitle, eleText, eleAuthor, isNew);
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
	cancelEdit: function(idx) {
		view.showCard(idx, 'editDel');
	},
	saveEdit: function(idx, title, text) {
		let cardId = deck.cards[idx].id;
		deck.editCard(cardId, title, text, idx);
	},
	cancelNewCard: function(idx) {
		deck.deleteCard(0, idx, true);
		view.showPage(1);
	},
	saveNewCard: function(idx, title, text, author) {
		deck.addCard(idx, title, text, author);
	}
};

let view = {
	cardsPerPage: 3,
	currentPage: 1,
	appTitleText: 'Card Demo',
	makeCard: function(idx, actionGroup) {

//		if (arguments.length > 2) {
//			setTimeout(function(){
//					let eleSrc = document.createElement('img');
//					eleSrc.setAttribute('src', deck.cards[idx].image_url);
//					eleImg.appendChild(eleSrc);
//			}, 0)
//		}

		let eleChild = document.createElement('div');
		eleChild.setAttribute('class', 'child');
		eleChild.setAttribute('id', idx);
		let eleImg = document.createElement('div');
		eleImg.setAttribute('class', 'img');
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
	showCard: function(idx, actionGroup) {
		let divElm = document.getElementById('main');
		divElm.replaceChild(this.makeCard(idx, actionGroup), document.getElementById(idx));
	},
	showPage: function(page) {
		this.currentPage = page;
		let eleMain = document.querySelector('#main');
		eleMain.innerHTML = '';
		this.showTitle();
		this.showPageInfo(this.currentPage);
		this.showPrevLink(this.currentPage);
		this.showNextLink(this.currentPage);
		for (var i = (page - 1) * this.cardsPerPage; i < (page * this.cardsPerPage); i++) {
    		if (deck.cards[i]) {
				eleMain.appendChild(this.makeCard(i,'editDel'));
			}
		}
//		this.loadImages();
	},
	createCardActionLinks: function(type) {
		let eleLinks = '';
		if (type === 'editDel') {
			eleLinks = '<li class="edit-links">✎ Edit</li><li class="delete-links">✕ Delete</li>';
		} else if (type === 'cancelSave') {
			eleLinks = '<li class="cancel-links">✕ Cancel</li><li class="save-links">✓ Save</li>';
		} else if (type === 'newCard') {
			eleLinks = '<li class="newcard-cancel-links">✕ Cancel</li><li class="newcard-save-links">✓ Save</li>';
		}
		return eleLinks;
	},
//	loadImages: function () {
//		let imgDiv = document.getElementsByClassName('img');
//		for (var i = 0; i < imgDiv.length; i++) {
//			(function(i) {
//				setTimeout(function() {
//					let eleImg = document.createElement('img');
//					eleImg.setAttribute('src', 'http://lorempixel.com/300/150/')
//					imgDiv[i].appendChild(eleImg);
//				}, 0); //3000 = 3seconds
//			})(i);
//		}
//	},
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
	showEditInputs: function(node, eleActions, eleTitle, eleText, eleAuthor, isNew) {

		let inputTitle = document.createElement('input');
		inputTitle.setAttribute('type', 'text');
		let areaText = document.createElement('textarea');
		let inputAuthor = document.createElement('input');
		inputAuthor.setAttribute('type', 'text');

		if (isNew) {
			inputTitle.placeholder = deck.cards[0].title;
			inputTitle.size = 32;
			areaText.placeholder = deck.cards[0].text;
			inputAuthor.placeholder = deck.cards[0].author;

			eleActions.innerHTML = this.createCardActionLinks('newCard');
			node.replaceChild(inputTitle, eleTitle);
			node.replaceChild(areaText, eleText);
			node.replaceChild(inputAuthor, eleAuthor);
		} else {
			inputTitle.value = node.children[1].innerHTML;
			inputTitle.size = 32;
			areaText.value = node.children[2].innerHTML;

			eleActions.innerHTML = this.createCardActionLinks('cancelSave');
			node.replaceChild(inputTitle, eleTitle);
			node.replaceChild(areaText, eleText);
		}
	},
	setupEventListeners: function() {
		deck.fetchCards();
		let cardIdx = 0;
		let title = '';
		let text = '';
		let author = '';
		let navElements = document.querySelector('nav');
		navElements.addEventListener('click', function(event) {
			let navElementClicked = event.target;
			if (navElementClicked.id === 'prev-link') {
				handlers.prevPage();
			} else if (navElementClicked.id === 'next-link') {
				handlers.nextPage();
			} else if (navElementClicked.id === 'add-card-link') {
				title = 'Card title'
				text = 'A few sentences. Be creative, be yourself. This is the easy part'
				author = 'Name or handle'
				handlers.addCard(title, text, author);
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
				cardIdx = cardElmClicked.parentNode.parentNode.parentNode.id;
				handlers.cancelEdit(cardIdx);
			} else if (cardElmClicked.className === 'save-links') {
				cardIdx = cardElmClicked.parentNode.parentNode.parentNode.id;
				title = cardElmClicked.parentNode.parentNode.childNodes[1].value;
				text = cardElmClicked.parentNode.parentNode.childNodes[2].value;
				handlers.saveEdit(cardIdx, title, text);
			} else if (cardElmClicked.className === 'newcard-cancel-links') {
				cardIdx = cardElmClicked.parentNode.parentNode.parentNode.id;
				handlers.cancelNewCard(cardIdx);
			} else if (cardElmClicked.className === 'newcard-save-links') {
				cardIdx = cardElmClicked.parentNode.parentNode.parentNode.id;
				title = cardElmClicked.parentNode.parentNode.childNodes[1].value;
				text = cardElmClicked.parentNode.parentNode.childNodes[2].value;
				author = cardElmClicked.parentNode.parentNode.childNodes[3].value;
				handlers.saveNewCard(cardIdx, title, text, author);
			}
		});
	}
};
view.setupEventListeners();
window.ddeck = view
})();
