(function() {

let deck = {
	cards: [],
	new: {
		title: '',
		text: '',
		author: '',
		image_url: ''
	},
	appconst: {
		image_url: 'http://lorempixel.com/300/150/',
		image_add_url: 'http://placehold.it/300x150/6cd7f7/333333?text=Add+a+Card',
		base_url: 'http://localhost:3000/cards',
		cards99: '?_page=1&_limit=99&_sort=id&_order=DESC'
	},
	modes: {
		view: 'Card Demo',
		new: 'Add Card',
		edit: 'Edit Cards'
	},
	setMode: function(mode) {
		if (mode === this.modes.view) {
			view.currentMode = this.modes.view;
		} else if (mode === this.modes.new) {
			view.currentMode = this.modes.new;
		} else {
			view.currentMode = this.modes.edit;
		}
	},
	Card: class {
		constructor(title, text, author) {
			this.id = this.nextId;
			this.title = title;
			this.text = text;
			this.author = author;
			this.image_url = deck.appconst.image_url;
		}
		get nextId() {
			let id = [];
			return (Math.max(...(deck.cards.map((card, i) => id[i] = card.id))))+1;
		}
	},
 	takeNap: function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	saveCards: function(arrOfCards) {
		arrOfCards.forEach((card, i) => this.cards[i] = card);
	},
	getNumPages: function() {
		return Math.ceil(this.cards.length / view.cardsPerPage);
	},
	addCard: function(title, text, author) {
		this.cards.unshift(new this.Card(title, text, author));
		this.saveCardToDb();
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
		const curl = this.appconst.base_url+ '/' + id
		fetch(curl, {
			method: 'DELETE'
		}).then(() => view.showPage(view.currentPage, view.currentMode))
	    .catch((err) => console.log(err));
	},
	saveEditedCardToDb: function(id, title, text, idx) {
		const curl = this.appconst.base_url+ '/' + id
		fetch(curl, {
			method: 'PATCH',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				title: title,
				text: text
			})
		}).then(() => view.showCard(idx, 'editDel', view.currentMode))
	    .catch((err) => console.log(err));
	},
	saveCardToDb: function() {
		view.currentPage = 1;
		fetch(this.appconst.base_url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify({
				title: deck.cards[0].title,
				text: deck.cards[0].text,
				author: deck.cards[0].author,
				image_url: this.appconst.image_url
			})
		}).then(() => view.showPage(1, deck.modes.view))
	    .catch((err) => console.log(err));
	},
	fetchCards: function() {
	  	const curl = this.appconst.base_url + this.appconst.cards99;
// research server-side pagination using header Link
//	  fetch(curl)
//	  	.then((result) => (result.headers.get('Link')))
//	    .catch((err) => console.log(err));
	  	fetch(curl)
	  		.then((result) => result.json())
	  			.then((data) => this.saveCards(data))
	        	.then(() => view.showPage(view.currentPage, view.currentMode))
	    .catch((err) => console.log(err));
	}
};

let handlers = {
//	addCard: function(title, text, author, mode) {
//		deck.addCard(title, text, author);
//		this.switchMode(mode);
//		this.editCard(0, 1);
//	},
	switchMode: function(page, mode) {
		deck.setMode(mode);
		mode === deck.modes.new ? (
			view.showNewPage(mode),
			this.editCard(0, mode)
		    ) : (
			view.showPage(page, mode)
		);
	},
	editCard: function(idx, mode) {
		let node = document.getElementById(idx).children[1];
		let eleActions = node.children[0];
		let eleTitle = node.children[1];
		let eleText = node.children[2];
		let eleAuthor = node.children[3];

		view.showEditInputs(node, eleActions, eleTitle, eleText, eleAuthor, mode);

	},
	deleteCard: function(idx) {
		let cardId = deck.cards[idx].id;
		deck.deleteCard(cardId, idx);
	},
	prevPage: function() {
		view.showPage(view.currentPage-1, view.currentMode);
	},
	nextPage: function() {
		view.showPage(view.currentPage+1, view.currentMode);
	},
	cancelEdit: function(idx) {
		view.showCard(idx, 'editDel', view.currentMode);
	},
	saveEdit: function(idx, title, text) {
		let cardId = deck.cards[idx].id;
		deck.editCard(cardId, title, text, idx);
	},
	cancelNewCard: function(idx) {
		deck.deleteCard(0, idx, true);
		view.showPage(1);
	},
	saveNewCard: function(title, text, author) {
		deck.addCard(title, text, author);
	}
};

let view = {
	cardsPerPage: 3,
	currentPage: 1,
	currentMode: deck.modes['view'],
	makeCard: function(idx, actionGroup, mode) {
		let eleChild = document.createElement('div');
		eleChild.setAttribute('class', 'child');
		eleChild.setAttribute('id', idx);
		let eleImg = document.createElement('div');
		eleImg.setAttribute('class', 'img');
		let eleSrc = document.createElement('img');
		mode === deck.modes.new ? eleSrc.setAttribute('src', deck.appconst.image_add_url) :
		eleSrc.setAttribute('src', deck.cards[idx].image_url);
		let eleInnerChild = document.createElement('div');
		eleInnerChild.setAttribute('class', 'child-inner');
		let eleTitle = document.createElement('h3');
		mode === deck.modes.new ? eleTitle.innerHTML = deck.new.title :
		eleTitle.innerHTML = deck.cards[idx].title;
		let eleText = document.createElement('p');
		mode === deck.modes.new ? eleText.innerHTML = deck.new.text :
		eleText.innerHTML = deck.cards[idx].text;
		let eleAuthor = document.createElement('p');
		eleAuthor.setAttribute('class', 'author');
		mode === deck.modes.new ? eleAuthor.innerHTML = '- ' + deck.new.author :
		eleAuthor.innerHTML = '- ' + deck.cards[idx].author;
		let eleLinkUl = document.createElement('ul');
		if (mode !== deck.modes.new) eleLinkUl.setAttribute('class', 'hide-card-links');
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
	showCard: function(idx, actionGroup, mode) {
		let divElm = document.getElementById('main');
		if (mode === deck.modes['new']) {
			divElm.appendChild(this.makeCard(idx, actionGroup, mode));
			document.getElementById(idx).classList.add('fadein');
		} else if (mode === deck.modes['edit']) {
			divElm.replaceChild(this.makeCard(idx, actionGroup), document.getElementById(idx));
			document.getElementById(idx).classList.add('fadein');
			document.getElementById(idx).getElementsByTagName('ul')[0].removeAttribute('class');

		}
	},
	showNewPage: function(mode) {
		document.getElementById('main').innerHTML = '';
		this.showTitle(mode);
		this.showNavBar(mode);
		this.showCard(0, 'newCard', mode);
	},
	showPage: function(page, mode) {
		this.currentPage = page;
		this.showTitle(mode);
		this.showNavBar(mode);
//		this.showPageInfo(this.currentPage);
//		this.showPrevLink(this.currentPage);
//		this.showNextLink(this.currentPage);
		//take a async break btwn each image http request
		this.showCards(page, mode);
	},
//	createCardActionLinks: function(type) {
//		let eleLinks = '';
//		if (type === 'editDel') {
//			eleLinks = '<li class="edit-links">✎ Edit</li><li class="delete-links">✕ Delete</li>';
//		} else if (type === 'newCard') {
//			eleLinks = '<li class="newcard-cancel-links">✕ Cancel</li><li class="newcard-save-links">✓ Save</li>';
//		}
//		return eleLinks;
//	},
	createCardActionLinks: function(type) {
		let eleLinks = '';
		if (type === 'editDel') {
			eleLinks = '<li class="edit-links">✎ Edit</li><li class="delete-links">✕ Delete</li>';
		} else if (type === 'cancelSave') {
			eleLinks = '<li class="cancel-links">✕ Cancel</li><li class="save-links">✓ Save</li>';
		} else if (type === 'newCard') {
			eleLinks = '<li class="newcard-save-links">✓ Save</li>';
		}
		return eleLinks;
	},
	showCards: async function (page, mode) {
		let eleMain = document.querySelector('#main');
		eleMain.innerHTML = '';
		for (let i = (page - 1) * this.cardsPerPage; i < (page * this.cardsPerPage); i++) {
    		if (deck.cards[i]) {
				eleMain.appendChild(this.makeCard(i,'editDel'));
				eleMain.lastChild.classList.add('moveRTL');
				await deck.takeNap(550);
				if (mode === deck.modes['edit']) {
					document.querySelector('.hide-card-links')
					.removeAttribute('class');
				}

			}
		}
//		if (mode === deck.modes['edit']) {
//			let elmUl = document.getElementsByClassName('hide-card-links');
//			//necessary because the num of ul elments decrases with each iteration
//			let numElm = elmUl.length;
//			for (let j = 0; j < numElm; j++) {
//				/* always at position 0 b/c each iteration
//				pushes the next elm to position 0 */
//				elmUl[0].removeAttribute('class');
//			}
//		}
	},
	showTitle: function(pageTitle) {
		let eleHeader = document.querySelector('header');
		eleHeader.innerHTML = pageTitle;
	},
	showNavBar: function(mode) {
		if (mode === deck.modes['new']) {
			document.getElementById('page-info').setAttribute('class', 'none');
			document.getElementById('prev-link').setAttribute('class', 'none');
			document.getElementById('next-link').setAttribute('class', 'none');
			this.showModeLinks(mode);
		} else  {
			document.getElementById('page-info').setAttribute('class', 'page-info');
			document.getElementById('prev-link').setAttribute('class', 'active');
			document.getElementById('next-link').setAttribute('class', 'active');
			this.showPageInfo(this.currentPage);
			this.showPrevLink(this.currentPage);
			this.showModeLinks(mode);
			this.showNextLink(this.currentPage);
		}
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
	showModeLinks: function(mode) {
		if (mode === deck.modes['edit']) {
			document.getElementById('card-demo').setAttribute('class', 'active');
			document.getElementById('add-card').setAttribute('class', 'active');
			document.getElementById('edit-cards').removeAttribute('class');
		} else if (mode === deck.modes['new']) {
			document.getElementById('card-demo').setAttribute('class', 'active');
			document.getElementById('add-card').removeAttribute('class');
			document.getElementById('edit-cards').setAttribute('class', 'active');
		} else {
			document.getElementById('card-demo').removeAttribute('class');
			document.getElementById('add-card').setAttribute('class', 'active');
			document.getElementById('edit-cards').setAttribute('class', 'active');
		}
	},
	showNextLink: function(page) {
		(page === deck.getNumPages()) ?
			document.querySelector('#next-link').style.visibility = "hidden" :
			document.querySelector('#next-link').removeAttribute('style')
	},
	showEditInputs: function(node, eleActions, eleTitle, eleText, eleAuthor, mode) {
		let inputTitle = document.createElement('input');
		inputTitle.setAttribute('type', 'text');
		let areaText = document.createElement('textarea');
		let inputAuthor = document.createElement('input');
		inputAuthor.setAttribute('type', 'text');

		if (mode === deck.modes['new']) {
			inputTitle.placeholder = 'Card title';
			inputTitle.size = 32;
			areaText.placeholder = 'A few sentences. Be creative, be yourself. This is the easy part';
			inputAuthor.placeholder = 'Name or handle';

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
			} else if (navElementClicked.id === 'add-card') {
//				title = 'Card title'
//				text = 'A few sentences. Be creative, be yourself. This is the easy part'
//				author = 'Name or handle'
				handlers.switchMode(view.currentPage, deck.modes.new);
			} else if (navElementClicked.id === 'edit-cards') {
				handlers.switchMode(view.currentPage, deck.modes.edit);
			} else if (navElementClicked.id === 'card-demo') {
				handlers.switchMode(view.currentPage, deck.modes.view);
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
				handlers.saveNewCard(title, text, author);
			}
		});
	}
};
view.setupEventListeners();
window.ddeck = view
})();
