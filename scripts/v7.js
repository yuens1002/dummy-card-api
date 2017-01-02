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
	checkForm: function(fields) {
		switch (true) {
			case fields.title && fields.text && fields.author:
				addCard(fields.title, fields.text, fields.author);
				break;
			case !fields.title:
				document.getElementsByTagName('label')[0].innerHTML = 'Title is Required!';
				document.querySelector('[name="title"]').focus();
				break;
			case !fields.text:
				console.log(document.getElementsByTagName('label')[1]);
				document.getElementsByTagName('label')[1].innerHTML = 'Paragrpah is Required!';
				document.querySelector('[name="text"]').focus();
				break;
			case !fields.author:
				document.getElementsByTagName('label')[2].innerHTML = 'Name or handle is Required!';
				document.querySelector('[name="author"]').focus();
				break;
			default:
				let elmP = document.createElement('p');
				elmP.innerHTML = 'All fields are required!';
				document.querySelector('.child-inner').insertBefore(elmP, document.querySelector('.child-inner').firstChild);
				break;
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
		}).then(() => view.showCard(idx, 'editDel'))
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
		mode === deck.modes['new'] ? view.showNewPage(mode) : view.showPage(page, mode)
	},
	editCard: function(idx) {
		let node = document.getElementById(idx).children[1];
		let eleActions = node.children[0];
		let eleTitle = node.children[1];
		let eleText = node.children[2];
		let eleAuthor = node.children[3];

		view.showEditInputs(node, eleActions, eleTitle, eleText, eleAuthor, idx);

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
		view.showCard(idx, 'editDel');
	},
	saveEdit: function(idx, title, text) {
		let cardId = deck.cards[idx].id;
		deck.editCard(cardId, title, text, idx);
	},
//	cancelNewCard: function(idx) {
//		deck.deleteCard(0, idx, true);
//		view.showPage(1);
//	},
	saveNewCard: function(fields) {
		deck.checkForm(fields);
//		deck.addCard(title, text, author);
	}
};

let view = {
	cardsPerPage: 3,
	currentPage: 1,
	currentMode: deck.modes['view'],
	CreateLinkElm: class {
		constructor(idx) {
			this.idx = idx;
			this.elmLi =  document.createElement('li');
			this.fnPath = 'ddeck.';
			this.links = {
				control: {
					prev: {
						fnName: 'prev',
						text: '← Prev'
					},
					next: {
						fnName: 'next',
						text: 'Next →'
					}
				},
				menu: {
					view: {
						fnName: 'view',
						text: '❐ Card Demo'
					},
					new: {
						fnName: 'newCard',
						text: '+ Add Card',
						save: {
							fnName: 'saveNew',
							text: '✓ Save'
						}
					},
					edit: {
						fnName: 'edit',
						text: '✎ Edit Cards',
						cancel: {
							fnName: 'cancelEdit',
							text: '✕ Cancel'
						},
						delete: {
							fnName: 'deleteCard',
							text: '✕ Delete'
						},
						save: {
							fnName: 'saveEdit',
							text: '✓ Save'
						},
						edit: {
							fnName: 'editCard',
							text: '✎ Edit Cards'
						}
					}
				}
			};
		}
		get prev() {
		this.makeLink(this.links.control.prev.text, {
			href: '#',
			id: 'prev-link',
			onclick: this.onclickValue(this.links.control.prev.fnName, 0)
		});
		return this.elmLi;
		}
		get next() {
			this.makeLink(this.links.control.next.text, {
				href: '#',
				id: 'next-link',
				onclick: this.onclickValue(this.links.control.next.fnName,0)
			});
			return this.elmLi;
		}
		get view() {
			this.makeLink(this.links.menu.view.text, {
				href: '#',
				id: 'card-demo',
				onclick: this.onclickValue(this.links.menu.view.fnName,0)
			});
			return this.elmLi;
		}
		get newCard() {
			this.makeLink(this.links.menu.new.text, {
				href: '#',
				id: 'add-card',
				onclick: this.onclickValue(this.links.menu.new.fnName,0)
			});
			return this.elmLi;
		}
		get saveNew() {
			this.makeLink(this.links.menu.new.save.text, {
				href: '#',
				onclick: this.onclickValue(this.links.menu.new.save.fnName,0)
			});
			return this.elmLi;
		}
		get edit() {
			this.makeLink(this.links.menu.edit.text, {
				href: '#',
				id: 'edit-cards',
				onclick: this.onclickValue(this.links.menu.edit.fnName,0)
			});
			return this.elmLi;
		}
		get cancelEdit() {
			this.makeLink(this.links.menu.edit.cancel.text, {
				href: '#',
				name: this.idx,
				onclick: this.onclickValue(this.links.menu.edit.cancel.fnName)
			});
			return this.elmLi;
		}
		get deleteCard() {
			this.makeLink(this.links.menu.edit.delete.text, {
				href: '#',
				name: this.idx,
				onclick: this.onclickValue(this.links.menu.edit.delete.fnName)
			});
			return this.elmLi;
		}
		get saveEdit() {
			this.makeLink(this.links.menu.edit.save.text, {
				href: '#',
				name: this.idx,
				onclick: this.onclickValue(this.links.menu.edit.save.fnName)
			});
			return this.elmLi;
		}
		get editCard() {
			this.makeLink(this.links.menu.edit.edit.text, {
				href: '#',
				name: this.idx,
				onclick: this.onclickValue(this.links.menu.edit.edit.fnName)
			});
			return this.elmLi;
		}
		onclickValue(fnName) {
			return (
				arguments.length > 1 ?
				this.fnPath+fnName+'();return false;' :
				this.fnPath+fnName+'(this);return false;'
			);
		}
		makeLink(text, attrs) {
			let elmA = document.createElement('a');
			for(var key in attrs) {
				elmA.setAttribute(key, attrs[key]);
			}
			elmA.innerHTML = text;
			this.elmLi.appendChild(elmA);
		}
	},
	makeCard: function(idx, actionGroup) {
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
		eleImg.appendChild(eleSrc);
		eleInnerChild.appendChild(this.createCardActionLinks(actionGroup, idx));
		eleInnerChild.appendChild(eleTitle);
		eleInnerChild.appendChild(eleText);
		eleInnerChild.appendChild(eleAuthor);
		eleChild.appendChild(eleImg);
		eleChild.appendChild(eleInnerChild);

		return eleChild;
	},
	makeNewCard: function(actionGroup) {
		let eleChild = document.createElement('div');
		eleChild.setAttribute('class', 'child');

		let eleImg = document.createElement('div');
		eleImg.setAttribute('class', 'img');
		let eleSrc = document.createElement('img');
		eleSrc.setAttribute('src', deck.appconst.image_add_url)
		eleImg.appendChild(eleSrc);
		eleChild.appendChild(eleImg);

		let labelTitle = document.createElement('label');
		labelTitle.innerHTML = 'Title';
		let inputTitle = document.createElement('input');
		inputTitle.setAttribute('type', 'text');
		inputTitle.setAttribute('name', 'title');
		inputTitle.placeholder = 'Card title';
		inputTitle.size = 32;

		let labelText = document.createElement('label');
		labelText.innerHTML = 'Paragraph';
		let areaText = document.createElement('textarea');
		areaText.setAttribute('name', 'text');
		areaText.placeholder = 'A few sentences. Be creative, be yourself. This is the easy part';

		let labelAuthor = document.createElement('label');
		labelAuthor.innerHTML = 'Name or Handle';
		let inputAuthor = document.createElement('input');
		inputAuthor.setAttribute('type', 'text');
		inputAuthor.setAttribute('name', 'author');
		inputAuthor.placeholder = 'Name or handle';

		let eleInnerChild = document.createElement('div');
		eleInnerChild.setAttribute('class', 'child-inner');
		eleInnerChild.appendChild(labelTitle);
		eleInnerChild.appendChild(inputTitle);
		eleInnerChild.appendChild(labelText);
		eleInnerChild.appendChild(areaText);
		eleInnerChild.appendChild(labelAuthor);
		eleInnerChild.appendChild(inputAuthor);

		eleInnerChild.appendChild(this.createCardActionLinks(actionGroup));
		eleChild.appendChild(eleInnerChild);

		return eleChild;
	},
	createCardActionLinks: function(type, idx) {
		let elmUlLinks = document.createElement('ul');
		if (type === 'editDel') {
			elmUlLinks.setAttribute('class', 'hide-card-links');
			elmUlLinks.appendChild(new this.CreateLinkElm(idx).editCard);
			elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteCard);
		} else if (type === 'cancelSave') {
			elmUlLinks.appendChild(new this.CreateLinkElm(idx).cancelEdit);
			elmUlLinks.appendChild(new this.CreateLinkElm(idx).saveEdit);
		} else if (type === 'newCard') {
			elmUlLinks.appendChild(new this.CreateLinkElm().saveNew);
		}
		return elmUlLinks;
	},
	showNewPage: function(mode) {
		let elmMain = document.getElementById('main');
		elmMain.innerHTML = '';
		this.showTitle(mode);
		this.showNavBar(mode);
		elmMain.appendChild(this.makeNewCard('newCard'));
		document.querySelector('.child').classList.add('fadein');
	},
	showCard: function(idx, actionGroup) {
		let divElm = document.getElementById('main');
		divElm.replaceChild(this.makeCard(idx, actionGroup), document.getElementById(idx));
		document.getElementById(idx).classList.add('fadein');
		document.getElementById(idx).getElementsByTagName('ul')[0].removeAttribute('class');
	},
	showPage: function(page, mode) {
		this.currentPage = page;
		this.showTitle(mode);
		this.showNavBar(mode);
		this.showCards(page, mode);
	},
	showCards: async function (page, mode) {
		let eleMain = document.querySelector('#main');
		eleMain.innerHTML = '';
		for (let i = (page - 1) * this.cardsPerPage; i < (page * this.cardsPerPage); i++) {
    		if (deck.cards[i]) {
				eleMain.appendChild(this.makeCard(i,'editDel'));
				eleMain.lastChild.classList.add('moveRTL');
				await deck.takeNap(400);
				if (mode === deck.modes['edit']) {
					document.querySelector('.hide-card-links')
					.removeAttribute('class');
				}
			}
		}
	},
	showTitle: function(pageTitle) {
		document.querySelector('header')
		.innerHTML = pageTitle;
	},
	showNavBar: function(mode) {
		if (document.querySelector('ul').childNodes.length === 0) {
			let elmUl = document.querySelector('ul');
			let elmPrevLink = new this.CreateLinkElm().prev;
			let elmNextLink = new this.CreateLinkElm().next;
			elmUl.innerHTML = '<br><br><li id="page-info" class="page-info"></li>';
			elmUl.appendChild(elmPrevLink);
			elmUl.appendChild(elmNextLink);
		}
		if (mode === deck.modes['new']) {
			document.getElementById('page-info').setAttribute('class', 'none');
			document.getElementById('prev-link').setAttribute('class', 'none');
			document.getElementById('next-link').setAttribute('class', 'none');
			this.showModeLinks(mode);
		} else  {
			document.getElementById('page-info').setAttribute('class', 'page-info');
			document.getElementById('prev-link').setAttribute('class', 'normal');
			document.getElementById('next-link').setAttribute('class', 'normal');
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
		if (document.querySelector('ul').childNodes.length === 5) {
			let elmUl = document.querySelector('ul');
			let elmCardDemoLink = new this.CreateLinkElm().view;
			let elmAddCardLink = new this.CreateLinkElm().newCard;
			let elmEditCardLink = new this.CreateLinkElm().edit;
			let elmDiv1 = document.createElement('li');
			elmDiv1.innerHTML = '|';
			elmDiv1.setAttribute('class', 'divider');
			let elmDiv2 = document.createElement('li');
			elmDiv2.innerHTML = '|';
			elmDiv2.setAttribute('class', 'divider');

			elmUl.insertBefore(elmEditCardLink, elmUl.firstChild);
			elmUl.insertBefore(elmDiv2, elmUl.firstChild);
			elmUl.insertBefore(elmAddCardLink, elmUl.firstChild);
			elmUl.insertBefore(elmDiv1, elmUl.firstChild);
			elmUl.insertBefore(elmCardDemoLink, elmUl.firstChild);
		}
		if (mode === deck.modes['edit']) {
			document.getElementById('card-demo').setAttribute('class', 'normal');
			document.getElementById('add-card').setAttribute('class', 'normal');
			document.getElementById('edit-cards').setAttribute('class', 'active');
		} else if (mode === deck.modes['new']) {
			document.getElementById('card-demo').setAttribute('class', 'normal');
			document.getElementById('add-card').setAttribute('class', 'active');
			document.getElementById('edit-cards').setAttribute('class', 'normal');
		} else {
			document.getElementById('card-demo').setAttribute('class', 'active');
			document.getElementById('add-card').setAttribute('class', 'normal');
			document.getElementById('edit-cards').setAttribute('class', 'normal');
		}
	},
	showNextLink: function(page) {
		(page === deck.getNumPages()) ?
			document.querySelector('#next-link').style.visibility = "hidden" :
			document.querySelector('#next-link').removeAttribute('style')
	},
	showEditInputs: function(node, eleActions, eleTitle, eleText, eleAuthor, idx) {
		let inputTitle = document.createElement('input');
		inputTitle.setAttribute('type', 'text');
		inputTitle.setAttribute('name', 'title');
		let areaText = document.createElement('textarea');
		areaText.setAttribute('name', 'text');
		let inputAuthor = document.createElement('input');
		inputAuthor.setAttribute('type', 'text');

		inputTitle.value = node.children[1].innerHTML;
		inputTitle.size = 32;
		areaText.value = node.children[2].innerHTML;

//		eleActions = this.createCardActionLinks('cancelSave', idx);
		node.replaceChild(this.createCardActionLinks('cancelSave', idx), eleActions);
		node.replaceChild(inputTitle, eleTitle);
		node.replaceChild(areaText, eleText);
	},
	formEventListener: function() {

	}
};

let events = {
	fields: {
		title: '',
		text: '',
		author: ''
	},
	init: function() {
		deck.fetchCards();
	},
	view: function() {
		handlers.switchMode(1, deck.modes.view);
	},
	newCard: function() {
		handlers.switchMode(1, deck.modes.new);
	},
	edit: function() {
		handlers.switchMode(1, deck.modes.edit);
	},
	prev: function() {
		handlers.prevPage();
	},
	next: function() {
		handlers.nextPage();
	},
	saveNew: function() {
		this.fields.title = document.querySelector('[name="title"]').value;
		this.fields.text = document.querySelector('[name="text"]').value;
		this.fields.author = document.querySelector('[name="author"]').value;
		handlers.saveNewCard(this.fields);
	},
	cancelEdit: function(linkObj) {
		handlers.cancelEdit(linkObj.name);
	},
	deleteCard: function(linkObj) {
		handlers.deleteCard(linkObj.name);
	},
	saveEdit: function(linkObj) {
		this.fields.title = document.getElementById(linkObj.name).querySelector('[name="title"]').value;
		this.fields.text = document.getElementById(linkObj.name).querySelector('[name="text"]').value;
		handlers.saveEdit(linkObj.name, this.fields.title, this.fields.text);
	},
	editCard: function(linkObj) {
		handlers.editCard(linkObj.name);
	}
};

events.init();
window.ddeck = events;
})();
