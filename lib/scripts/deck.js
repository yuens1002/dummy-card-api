'use strict';

ddeck.getMods('deck', function() {
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
			// placeHold is down currently, setting to image_url temporarily
			image_add_url: 'http://lorempixel.com/300/150/',
	//		image_add_url: 'http://placehold.it/300x150/6cd7f7/333333?text=Add+a+Card',
			base_url: 'http://localhost:3000/cards',
			cards99: '?_page=1&_limit=99&_sort=id&_order=DESC'
		},
		form: {
			label: {
				required: ' is Required!',
				title: {
					feedback: 'awesome dude!',
					default: 'Card Title'
				},
				text: {
					feedback: 'hOoley smokes... one more to go!',
					default: 'Paragraph'
				},
				author: {
					feedback: 'you\'re so cool!',
					default: 'Name or Handle'
				}
			},
			placeholder: {
				title: 'Card title',
				text: 'A few sentences. Be creative, be yourself. This is the easy part',
				author: 'Name or handle'
			}
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
				this.id = this.nextId.call(deck);
				this.title = title;
				this.text = text;
				this.author = author;
				this.image_url = deck.appconst.image_url;
			}
			nextId() {
				let id = [];
				return (Math.max(...(this.cards.map((card, i) => id[i] = card.id))))+1;
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
			view.formEventListeners(1);
			/* need to set the mode b/c it's not going back to current */
			this.setMode(this.modes.view);
			this.cards.unshift(new this.Card(title, text, author));
			this.saveCardToDb();
		},
		editCard: function(id, title, text, idx) {
			//turns the listener with the spec idx off
			view.editFormListeners(idx, 'off');
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
			let numValidField = 0;
			let	newCard = {
				title: function() {
					document.getElementsByTagName('label')[0].innerHTML =
						deck.form.label.title.default + deck.form.label.required;
					document.querySelector('[name="title"]').focus();
				},
				text: function() {
					document.getElementsByTagName('label')[1].innerHTML =
						deck.form.label.text.default + deck.form.label.required;
					document.querySelector('[name="text"]').focus();
				},
				author: function() {
					document.getElementsByTagName('label')[2].innerHTML =
						deck.form.label.author.default + deck.form.label.required;
					document.querySelector('[name="author"]').focus();
				}
			};
			let editCard = {
				title: function() {
					/ * this variable not exist if idx doesnt from fields */
					let editTitleInput =
						document.getElementById(fields.idx).querySelector('[name="title"]');
					editTitleInput.setAttribute('placeholder',
						deck.form.label.title.default + deck.form.label.required);
					editTitleInput.focus();
				},
				text: function() {
					/ * these variables do not exist if idx doesnt from fields */
					let editTitleInput =
						document.getElementById(fields.idx).querySelector('[name="title"]'),
						editTextInput =
						document.getElementById(fields.idx).querySelector('[name="text"]');
					editTextInput.setAttribute('placeholder',
						deck.form.label.text.default + deck.form.label.required);
					/* if focus isn't on title input, focus on the text input */
					document.activeElement !== editTitleInput && editTextInput.focus();
				}
			};
			/* form is the newCard variable defined above */
			function processNewForm(form) {
				for (let key in fields) {
					fields[key].trim();
					!!fields[key] ? numValidField++ : form[key]();
				}
			}
			/* form is the editCard variable defined above */
			function processEditForm(form) {
				!!fields['title'].trim() ? numValidField++ : form['title']();
				!!fields['text'].trim() ? numValidField++ : form['text']();
			}

			Object.size = function(obj) {
				let size = 0, key;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) size++;
				}
				return size;
			};

			if (view.currentMode === this.modes.new) {
				processNewForm(newCard);
				/* using an && operator to "if true then do" */
				numValidField === Object.size(fields) &&
				this.addCard(fields.title, fields.text, fields.author);
			} else {
				processEditForm(editCard);
				// factoring the idx property
				if (numValidField === Object.size(fields)-1) {

					let cardId = deck.cards[fields.idx].id;
					this.editCard(cardId, fields.title, fields.text, fields.idx);
					// calll handler.status(fields.idx, 'form saved');
				}
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
			}).then(() => view.showPage(1, this.modes.view))
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
	return deck;
});
