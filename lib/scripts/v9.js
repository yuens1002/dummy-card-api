'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	var deck = {
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
			base_url: 'http://104.236.131.116:8080/cards',
			//http://localhost:3000/cards
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
		setMode: function setMode(mode) {
			if (mode === this.modes.view) {
				view.currentMode = this.modes.view;
			} else if (mode === this.modes.new) {
				view.currentMode = this.modes.new;
			} else {
				view.currentMode = this.modes.edit;
			}
		},
		Card: function () {
			function Card(title, text, author) {
				_classCallCheck(this, Card);

				this.id = this.nextId.call(deck);
				this.title = title;
				this.text = text;
				this.author = author;
				this.image_url = deck.appconst.image_url;
			}

			_createClass(Card, [{
				key: 'nextId',
				value: function nextId() {
					var id = [];
					return Math.max.apply(Math, _toConsumableArray(this.cards.map(function (card, i) {
						return id[i] = card.id;
					}))) + 1;
				}
			}]);

			return Card;
		}(),
		takeNap: function takeNap(ms) {
			return new Promise(function (resolve) {
				return setTimeout(resolve, ms);
			});
		},
		saveCards: function saveCards(arrOfCards) {
			var _this = this;

			arrOfCards.forEach(function (card, i) {
				return _this.cards[i] = card;
			});
		},
		getNumPages: function getNumPages() {
			return Math.ceil(this.cards.length / view.cardsPerPage);
		},
		addCard: function addCard(title, text, author) {
			view.formEventListeners(1);
			/* need to set the mode b/c it's not going back to current */
			this.setMode(this.modes.view);
			this.cards.unshift(new this.Card(title, text, author));
			this.saveCardToDb();
		},
		editCard: function editCard(id, title, text, idx) {
			//turns the listener with the spec idx off
			view.editFormListeners(idx, 'off');
			this.cards[idx].title = title;
			this.cards[idx].text = text;
			this.saveEditedCardToDb(id, title, text, idx);
		},
		deleteCard: function deleteCard(idx) {
			this.cards.splice(idx, 1);
		},
		checkForm: function checkForm(fields) {
			var numValidField = 0;
			var newCard = {
				title: function title() {
					document.getElementsByTagName('label')[0].innerHTML = deck.form.label.title.default + deck.form.label.required;
					document.querySelector('[name="title"]').focus();
				},
				text: function text() {
					document.getElementsByTagName('label')[1].innerHTML = deck.form.label.text.default + deck.form.label.required;
					document.querySelector('[name="text"]').focus();
				},
				author: function author() {
					document.getElementsByTagName('label')[2].innerHTML = deck.form.label.author.default + deck.form.label.required;
					document.querySelector('[name="author"]').focus();
				}
			};
			var editCard = {
				title: function title() {
					/ * this variable not exist if idx doesnt from fields */;
					var editTitleInput = document.getElementById(fields.idx).querySelector('[name="title"]');
					editTitleInput.setAttribute('placeholder', deck.form.label.title.default + deck.form.label.required);
					editTitleInput.focus();
				},
				text: function text() {
					/ * these variables do not exist if idx doesnt from fields */;
					var editTitleInput = document.getElementById(fields.idx).querySelector('[name="title"]'),
					    editTextInput = document.getElementById(fields.idx).querySelector('[name="text"]');
					editTextInput.setAttribute('placeholder', deck.form.label.text.default + deck.form.label.required);
					/* if focus isn't on title input, focus on the text input */
					document.activeElement !== editTitleInput && editTextInput.focus();
				}
			};
			/* form is the newCard variable defined above */
			function processNewForm(form) {
				for (var key in fields) {
					fields[key].trim();
					!!fields[key] ? numValidField++ : form[key]();
				}
			}
			/* form is the editCard variable defined above */
			function processEditForm(form) {
				!!fields['title'].trim() ? numValidField++ : form['title']();
				!!fields['text'].trim() ? numValidField++ : form['text']();
			}

			Object.size = function (obj) {
				var size = 0,
				    key = void 0;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) size++;
				}
				return size;
			};

			if (view.currentMode === this.modes.new) {
				processNewForm(newCard);
				/* using an && operator to "if true then do" */
				numValidField === Object.size(fields) && this.addCard(fields.title, fields.text, fields.author);
			} else {
				processEditForm(editCard);
				// factoring the idx property
				if (numValidField === Object.size(fields) - 1) {

					var cardId = deck.cards[fields.idx].id;
					this.editCard(cardId, fields.title, fields.text, fields.idx);
					// calll handler.status(fields.idx, 'form saved');
				}
			}
		},
		delCardFromDb: function delCardFromDb(id) {
			var curl = this.appconst.base_url + '/' + id;
			fetch(curl, {
				method: 'DELETE'
			}) /* .then(() => view.showPage(view.currentPage, view.currentMode)) */
			.catch(function (err) {
				return console.log(err);
			});
		},
		saveEditedCardToDb: function saveEditedCardToDb(id, title, text, idx) {
			var curl = this.appconst.base_url + '/' + id;
			fetch(curl, {
				method: 'PATCH',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					title: title,
					text: text
				})
			}).then(function () {
				return view.showCard(idx, 'editDel');
			}).catch(function (err) {
				return console.log(err);
			});
		},
		saveCardToDb: function saveCardToDb() {
			var _this2 = this;

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
			}).then(function () {
				return view.showPage(1, _this2.modes.view);
			}).catch(function (err) {
				return console.log(err);
			});
		},
		fetchCards: function fetchCards() {
			var _this3 = this;

			var curl = this.appconst.base_url + this.appconst.cards99;
			// research server-side pagination using header Link
			//	  fetch(curl)
			//	  	.then((result) => (result.headers.get('Link')))
			//	    .catch((err) => console.log(err));
			fetch(curl).then(function (result) {
				return result.json();
			}).then(function (data) {
				return _this3.saveCards(data);
			}).then(function () {
				return view.showPage(view.currentPage, view.currentMode);
			}).catch(function (err) {
				return console.log(err);
			});
		}
	};

	var handlers = {
		init: function init() {
			deck.fetchCards();
		},
		switchMode: function switchMode(page, mode) {
			deck.setMode(mode);
			mode === deck.modes.new ? view.showNewPage(mode) : view.showPage(page, mode);
		},
		editCard: function editCard(idx) {
			var node = document.getElementById(idx).children[1];
			var eleActions = node.children[0];
			var eleTitle = node.children[1];
			var eleText = node.children[2];
			var eleAuthor = node.children[3];
			view.showEditInputs(node, eleActions, eleTitle, eleText, eleAuthor, idx);
		},
		removeCard: function removeCard(idx) {
			view.removeCard(idx);
		},
		deleteCard: function deleteCard(idx) {
			var cardId = deck.cards[idx].id;
			deck.deleteCard(idx);
			deck.delCardFromDb(cardId);
		},
		prevPage: function prevPage() {
			view.showPage(view.currentPage - 1, view.currentMode);
		},
		nextPage: function nextPage() {
			view.showPage(view.currentPage + 1, view.currentMode);
		},
		cancelEdit: function cancelEdit(idx) {
			//turns the listener with the the spec idx off
			view.editFormListeners(idx, 'off');
			view.showCard(idx, 'editDel');
		},
		saveEdit: function saveEdit(fields) {
			deck.checkForm(fields);
		},
		saveNewCard: function saveNewCard(fields) {
			deck.checkForm(fields);
		},
		confirmDelete: function confirmDelete(idx) {
			view.showDeleteConfirmation(idx);
		},
		cancelDelete: function cancelDelete(idx) {
			var node = document.getElementById(idx).querySelector('.child-inner');
			node.replaceChild(view.createCardActionLinks('editDelVisible', idx), node.firstChild);
		}
	};

	var view = {
		cardsPerPage: 3,
		currentPage: 1,
		currentMode: deck.modes.view,
		CreateLinkElm: function () {
			function CreateLinkElm(idx) {
				_classCallCheck(this, CreateLinkElm);

				this.idx = idx;
				this.elmLi = document.createElement('li');
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
								text: '✕ Delete',
								yes: {
									fnName: 'deleteYes',
									text: '✓ Yes'
								},
								no: {
									fnName: 'deleteNo',
									text: '✕ No'
								}
							},
							save: {
								fnName: 'saveEdit',
								text: '✓ Save'
							},
							edit: {
								fnName: 'editCard',
								text: '✎ Edit Card'
							}
						}
					}
				};
			}

			_createClass(CreateLinkElm, [{
				key: 'onclickValue',
				value: function onclickValue(fnName) {
					return arguments.length > 1 ? this.fnPath + fnName + '();return false;' : this.fnPath + fnName + '(this);return false;';
				}
			}, {
				key: 'makeLink',
				value: function makeLink(text, attrs) {
					var elmA = document.createElement('a');
					for (var key in attrs) {
						elmA.setAttribute(key, attrs[key]);
					}
					elmA.innerHTML = text;
					this.elmLi.appendChild(elmA);
				}
			}, {
				key: 'prev',
				get: function get() {
					this.makeLink(this.links.control.prev.text, {
						href: '#',
						id: 'prev-link',
						onclick: this.onclickValue(this.links.control.prev.fnName, 0)
					});
					return this.elmLi;
				}
			}, {
				key: 'next',
				get: function get() {
					this.makeLink(this.links.control.next.text, {
						href: '#',
						id: 'next-link',
						onclick: this.onclickValue(this.links.control.next.fnName, 0)
					});
					return this.elmLi;
				}
			}, {
				key: 'view',
				get: function get() {
					this.makeLink(this.links.menu.view.text, {
						href: '#',
						id: 'card-demo',
						onclick: this.onclickValue(this.links.menu.view.fnName, 0)
					});
					return this.elmLi;
				}
			}, {
				key: 'newCard',
				get: function get() {
					this.makeLink(this.links.menu.new.text, {
						href: '#',
						id: 'add-card',
						onclick: this.onclickValue(this.links.menu.new.fnName, 0)
					});
					return this.elmLi;
				}
			}, {
				key: 'saveNew',
				get: function get() {
					this.makeLink(this.links.menu.new.save.text, {
						href: '#',
						onclick: this.onclickValue(this.links.menu.new.save.fnName, 0)
					});
					return this.elmLi;
				}
			}, {
				key: 'edit',
				get: function get() {
					this.makeLink(this.links.menu.edit.text, {
						href: '#',
						id: 'edit-cards',
						onclick: this.onclickValue(this.links.menu.edit.fnName, 0)
					});
					return this.elmLi;
				}
			}, {
				key: 'cancelEdit',
				get: function get() {
					this.makeLink(this.links.menu.edit.cancel.text, {
						href: '#',
						name: this.idx,
						onclick: this.onclickValue(this.links.menu.edit.cancel.fnName)
					});
					return this.elmLi;
				}
			}, {
				key: 'deleteCard',
				get: function get() {
					this.makeLink(this.links.menu.edit.delete.text, {
						href: '#',
						name: this.idx,
						onclick: this.onclickValue(this.links.menu.edit.delete.fnName)
					});
					return this.elmLi;
				}
				// needs to edit

			}, {
				key: 'deleteYes',
				get: function get() {
					this.makeLink(this.links.menu.edit.delete.yes.text, {
						href: '#',
						name: this.idx,
						onclick: this.onclickValue(this.links.menu.edit.delete.yes.fnName)
					});
					return this.elmLi;
				}
				// needs to edit

			}, {
				key: 'deleteNo',
				get: function get() {
					this.makeLink(this.links.menu.edit.delete.no.text, {
						href: '#',
						name: this.idx,
						onclick: this.onclickValue(this.links.menu.edit.delete.no.fnName)
					});
					return this.elmLi;
				}
			}, {
				key: 'saveEdit',
				get: function get() {
					this.makeLink(this.links.menu.edit.save.text, {
						href: '#',
						name: this.idx,
						onclick: this.onclickValue(this.links.menu.edit.save.fnName)
					});
					return this.elmLi;
				}
			}, {
				key: 'editCard',
				get: function get() {
					this.makeLink(this.links.menu.edit.edit.text, {
						href: '#',
						name: this.idx,
						onclick: this.onclickValue(this.links.menu.edit.edit.fnName)
					});
					return this.elmLi;
				}
			}]);

			return CreateLinkElm;
		}(),
		makeCard: function makeCard(idx, actionGroup) {
			var eleChild = document.createElement('div');
			eleChild.setAttribute('class', 'child');
			eleChild.setAttribute('id', idx);
			var eleImg = document.createElement('div');
			eleImg.setAttribute('class', 'img');
			var eleSrc = document.createElement('img');
			eleSrc.setAttribute('src', deck.cards[idx].image_url);
			var eleInnerChild = document.createElement('div');
			eleInnerChild.setAttribute('class', 'child-inner');
			var eleTitle = document.createElement('h3');
			eleTitle.innerHTML = deck.cards[idx].title;
			var eleText = document.createElement('p');
			eleText.innerHTML = deck.cards[idx].text;
			var eleAuthor = document.createElement('p');
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
		makeNewCard: function makeNewCard(actionGroup) {
			var eleChild = document.createElement('div');
			eleChild.setAttribute('class', 'child');

			var eleImg = document.createElement('div');
			eleImg.setAttribute('class', 'img');
			var eleSrc = document.createElement('img');
			setTimeout(eleSrc.setAttribute('src', deck.appconst.image_add_url), 500);
			eleImg.appendChild(eleSrc);
			eleChild.appendChild(eleImg);

			var labelTitle = document.createElement('label');
			labelTitle.innerHTML = deck.form.label.title.default;
			var inputTitle = document.createElement('input');
			inputTitle.setAttribute('type', 'text');
			inputTitle.setAttribute('name', 'title');
			inputTitle.placeholder = deck.form.placeholder.title;
			inputTitle.size = 32;

			var labelText = document.createElement('label');
			labelText.innerHTML = deck.form.label.text.default;
			var areaText = document.createElement('textarea');
			areaText.setAttribute('name', 'text');
			areaText.placeholder = deck.form.placeholder.text;

			var labelAuthor = document.createElement('label');
			labelAuthor.innerHTML = deck.form.label.author.default;
			var inputAuthor = document.createElement('input');
			inputAuthor.setAttribute('type', 'text');
			inputAuthor.setAttribute('name', 'author');
			inputAuthor.placeholder = deck.form.placeholder.author;

			var eleInnerChild = document.createElement('div');
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
		createCardActionLinks: function createCardActionLinks(name, idx) {
			var elmUlLinks = document.createElement('ul'),
			    types = {
				editDel: function editDel() {
					elmUlLinks.setAttribute('class', 'hide-card-links');
					elmUlLinks.appendChild(new this.CreateLinkElm(idx).editCard);
					elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteCard);
				},
				editDelVisible: function editDelVisible() {
					elmUlLinks.appendChild(new this.CreateLinkElm(idx).editCard);
					elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteCard);
				},
				cancelSave: function cancelSave() {
					elmUlLinks.appendChild(new this.CreateLinkElm(idx).cancelEdit);
					elmUlLinks.appendChild(new this.CreateLinkElm(idx).saveEdit);
				},
				newCard: function newCard() {
					elmUlLinks.appendChild(new this.CreateLinkElm().saveNew);
				},
				yesNo: function yesNo() {
					var elmP = document.createElement('p');
					// need to grab the text here frin an obj model
					elmP.innerHTML = 'Are you Sure? Choose Yes to confirm delete or No to cancel';
					elmUlLinks.appendChild(elmP);
					elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteNo);
					elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteYes);
				}
			};
			types[name].call(this);
			return elmUlLinks;
		},
		showNewPage: function showNewPage(mode) {
			var elmMain = document.getElementById('main');
			elmMain.innerHTML = '';
			this.showTitle(mode);
			this.showNavBar(mode);
			elmMain.appendChild(this.makeNewCard('newCard'));
			document.querySelector('.child').classList.add('fadein');
		},
		showCard: function showCard(idx, actionGroup) {
			var divElm = document.getElementById('main');
			divElm.replaceChild(this.makeCard(idx, actionGroup), document.getElementById(idx));
			document.getElementById(idx).classList.add('fadein');
			document.getElementById(idx).getElementsByTagName('ul')[0].removeAttribute('class');
		},
		showPage: function showPage(page, mode) {
			this.currentPage = page;
			this.showTitle(mode);
			this.showNavBar(mode);
			this.showCards(page, mode);
		},
		showCards: function showCards(page, mode) {
			var eleMain = document.querySelector('#main');
			eleMain.innerHTML = '';
			for (var i = (page - 1) * this.cardsPerPage; i < page * this.cardsPerPage; i++) {
				if (deck.cards[i]) {
					eleMain.appendChild(this.makeCard(i, 'editDel'));
					eleMain.lastChild.classList.add('moveRTL');
					if (mode === deck.modes['edit']) {
						document.querySelector('.hide-card-links').removeAttribute('class');
					}
				}
			}
		},
		showTitle: function showTitle(pageTitle) {
			document.querySelector('header').innerHTML = pageTitle;
		},
		showNavBar: function showNavBar(mode) {
			if (document.querySelector('ul').childNodes.length === 0) {
				var elmUl = document.querySelector('ul');
				var elmPrevLink = new this.CreateLinkElm().prev;
				var elmNextLink = new this.CreateLinkElm().next;
				elmUl.innerHTML = '<br><br><li id="page-info" class="page-info"></li>';
				elmUl.appendChild(elmPrevLink);
				elmUl.appendChild(elmNextLink);
			}
			if (mode === deck.modes.new) {
				document.getElementById('page-info').setAttribute('class', 'none');
				document.getElementById('prev-link').setAttribute('class', 'none');
				document.getElementById('next-link').setAttribute('class', 'none');
				this.showModeLinks(mode);
			} else {
				document.getElementById('page-info').setAttribute('class', 'page-info');
				document.getElementById('prev-link').setAttribute('class', 'normal');
				document.getElementById('next-link').setAttribute('class', 'normal');
				this.showModeLinks(mode);
				this.showPageInfo(this.currentPage);
				this.showPrevLink(this.currentPage);
				this.showNextLink(this.currentPage);
			}
		},
		showPageInfo: function showPageInfo(page) {
			var pageInfo = document.querySelector('.page-info');
			pageInfo.innerHTML = 'Page ' + page + ' of ' + deck.getNumPages();
		},
		showPrevLink: function showPrevLink(page) {
			page === 1 ? document.querySelector('#prev-link').style.visibility = "hidden" : document.querySelector('#prev-link').removeAttribute('style');
		},
		showModeLinks: function showModeLinks(mode) {
			if (document.querySelector('ul').childNodes.length === 5) {
				var elmUl = document.querySelector('ul');
				var elmCardDemoLink = new this.CreateLinkElm().view;
				var elmAddCardLink = new this.CreateLinkElm().newCard;
				var elmEditCardLink = new this.CreateLinkElm().edit;
				var elmDiv1 = document.createElement('li');
				elmDiv1.innerHTML = '|';
				elmDiv1.setAttribute('class', 'divider');
				var elmDiv2 = document.createElement('li');
				elmDiv2.innerHTML = '|';
				elmDiv2.setAttribute('class', 'divider');

				elmUl.insertBefore(elmEditCardLink, elmUl.firstChild);
				elmUl.insertBefore(elmDiv2, elmUl.firstChild);
				elmUl.insertBefore(elmAddCardLink, elmUl.firstChild);
				elmUl.insertBefore(elmDiv1, elmUl.firstChild);
				elmUl.insertBefore(elmCardDemoLink, elmUl.firstChild);
			}
			if (mode === deck.modes.edit) {
				document.getElementById('card-demo').setAttribute('class', 'normal');
				document.getElementById('add-card').setAttribute('class', 'normal');
				document.getElementById('edit-cards').setAttribute('class', 'active');
			} else if (mode === deck.modes.new) {
				document.getElementById('card-demo').setAttribute('class', 'normal');
				document.getElementById('add-card').setAttribute('class', 'active');
				document.getElementById('edit-cards').setAttribute('class', 'normal');
			} else {
				document.getElementById('card-demo').setAttribute('class', 'active');
				document.getElementById('add-card').setAttribute('class', 'normal');
				document.getElementById('edit-cards').setAttribute('class', 'normal');
			}
		},
		showNextLink: function showNextLink(page) {
			page === deck.getNumPages() ? document.querySelector('#next-link').style.visibility = "hidden" : document.querySelector('#next-link').removeAttribute('style');
		},
		showEditInputs: function showEditInputs(node, eleActions, eleTitle, eleText, eleAuthor, idx) {
			var inputTitle = document.createElement('input');
			inputTitle.setAttribute('type', 'text');
			inputTitle.setAttribute('name', 'title');
			inputTitle.setAttribute('placeholder', deck.form.placeholder.title);
			var areaText = document.createElement('textarea');
			areaText.setAttribute('name', 'text');
			areaText.setAttribute('placeholder', deck.form.placeholder.text);
			//		let inputAuthor = document.createElement('input');
			//		inputAuthor.setAttribute('type', 'text');

			inputTitle.value = node.children[1].innerHTML;
			inputTitle.size = 32;
			areaText.value = node.children[2].innerHTML;

			node.replaceChild(this.createCardActionLinks('cancelSave', idx), eleActions);
			node.replaceChild(inputTitle, eleTitle);
			node.replaceChild(areaText, eleText);
			// 'on' sets the listener to turn on
			this.editFormListeners(idx, 'on');
		},
		showDeleteConfirmation: function showDeleteConfirmation(idx) {
			var node = document.getElementById(idx).querySelector('.child-inner');
			node.replaceChild(this.createCardActionLinks('yesNo', idx), node.firstChild);
		},
		removeCard: function removeCard(idx) {
			idx = parseInt(idx);
			var elmMain = document.getElementById('main'),
			    elmChildToRemove = document.getElementById(idx),
			    elmChilds = document.getElementsByClassName('child'),
			    childIdx = [],
			    currentPage = 0,
			    nextCardIdx = 0;
			for (var i = 0; i < elmChilds.length; i++) {
				childIdx[i] = parseInt(elmChilds[i].getAttribute('id'));
			}
			function resetNameId(elmChild) {
				var idxToRest = childIdx[elmChild] - 1;
				elmChilds[elmChild].setAttribute('id', idxToRest);
				elmChilds[elmChild].getElementsByTagName('a')[0].setAttribute('name', idxToRest);
				elmChilds[elmChild].getElementsByTagName('a')[1].setAttribute('name', idxToRest);
			}
			// refactor: turn into an event listner to sequence the animations
			function removeElm(toAdd) {
				elmChildToRemove.classList.add('fadeout');
				elmChilds.length !== 1 && setTimeout(elmChildToRemove.remove(), 500);
				handlers.deleteCard(idx);
				if (!!toAdd) {
					nextCardIdx = parseInt(elmMain.lastChild.getAttribute('id')) + 1;
					deck.cards.length !== nextCardIdx && elmMain.appendChild(view.makeCard(nextCardIdx, 'editDelVisible'));
					currentPage = Math.ceil((parseInt(elmMain.lastChild.getAttribute('id')) + 1) / view.cardsPerPage);!currentPage ? view.currentPage = 1 : view.currentPage = currentPage;
					view.showNavBar(deck.modes.edit);
				}
			}
			switch (elmChilds.length) {
				case 3:
					if (idx === childIdx[0]) {
						resetNameId(1);
						resetNameId(2);
					}
					idx === childIdx[1] && resetNameId(2);
					removeElm(true);
					break;
				case 2:
					idx === childIdx[0] && resetNameId(1);
					removeElm();
					break;
				case 1:
					removeElm();
					handlers.prevPage();
					break;
			}
		},
		formEventListeners: function formEventListeners(toStop) {
			var elmTitleInput = document.querySelector('[name="title"]'),
			    elmTextInput = document.querySelector('[name="text"]'),
			    elmAuthorInput = document.querySelector('[name="author"]'),
			    elmTitleLabel = document.getElementsByTagName('label')[0],
			    elmTextLabel = document.getElementsByTagName('label')[1],
			    elmAuthorLabel = document.getElementsByTagName('label')[2];
			if (arguments.length === 0) {
				elmTitleInput.addEventListener('blur', swapLabel, this, false);
				elmTextInput.addEventListener('blur', swapLabel, this, false);
				elmAuthorInput.addEventListener('blur', swapLabel, this, false);
			} else {
				elmTitleInput.removeEventListener('blur', swapLabel, false);
				elmTextInput.removeEventListener('blur', swapLabel, false);
				elmAuthorInput.removeEventListener('blur', swapLabel, false);
			}
			function swapLabel(field) {
				switch (field.target.name) {
					case 'title':
						!field.target.value ? elmTitleLabel.innerHTML = deck.form.label.title.default + deck.form.label.required : elmTitleLabel.innerHTML = deck.form.label.title.feedback;
						break;
					case 'text':
						!field.target.value ? elmTextLabel.innerHTML = deck.form.label.text.default + deck.form.label.required : elmTextLabel.innerHTML = deck.form.label.text.feedback;
						break;
					case 'author':
						!field.target.value ? elmAuthorLabel.innerHTML = deck.form.label.author.default + deck.form.label.required : elmAuthorLabel.innerHTML = deck.form.label.author.feedback;
						break;
				}
			}
		},
		editFormListeners: function editFormListeners(idx, addRemoveSwitch) {
			var input = document.getElementById(idx).querySelector('input');
			var textArea = document.getElementById(idx).querySelector('textarea');

			if (addRemoveSwitch === 'on') {
				input.addEventListener('blur', function setAttr() {
					this.value === '' && this.setAttribute('placeholder', deck.form.label.title.default + deck.form.label.required);
				}, false);
			} else {
				input.removeEventListener('blur', function setAttr() {
					this.value === '' && this.setAttribute('placeholder', deck.form.label.title.default + deck.form.label.required);
				}, false);
			}

			if (addRemoveSwitch === 'on') {
				textArea.addEventListener('blur', function setAttr() {
					this.value === '' && this.setAttribute('placeholder', deck.form.label.text.default + deck.form.label.required);
				}, false);
			} else {
				textArea.removeEventListener('blur', function setAttr() {
					this.value === '' && this.setAttribute('placeholder', deck.form.label.text.default + deck.form.label.required);
				}, false);
			}
		}
	};

	var events = {
		fields: {
			title: '',
			text: '',
			author: ''
		},
		init: function init() {
			handlers.init();
		},
		view: function view() {
			handlers.switchMode(1, deck.modes.view);
		},
		newCard: function newCard() {
			handlers.switchMode(1, deck.modes.new);
			view.formEventListeners();
		},
		edit: function edit() {
			handlers.switchMode(1, deck.modes.edit);
		},
		prev: function prev() {
			handlers.prevPage();
		},
		next: function next() {
			handlers.nextPage();
		},
		saveNew: function saveNew() {
			this.fields.title = document.querySelector('[name="title"]').value;
			this.fields.text = document.querySelector('[name="text"]').value;
			this.fields.author = document.querySelector('[name="author"]').value;
			handlers.saveNewCard(this.fields);
		},
		cancelEdit: function cancelEdit(linkObj) {
			handlers.cancelEdit(linkObj.name);
		},
		deleteCard: function deleteCard(linkObj) {
			handlers.confirmDelete(linkObj.name);
		},
		deleteYes: function deleteYes(linkObj) {
			handlers.removeCard(linkObj.name);
		},
		deleteNo: function deleteNo(linkObj) {
			handlers.cancelDelete(linkObj.name);
		},
		saveEdit: function saveEdit(linkObj) {
			this.fields.title = document.getElementById(linkObj.name).querySelector('[name="title"]').value;
			this.fields.text = document.getElementById(linkObj.name).querySelector('[name="text"]').value;
			handlers.saveEdit({ idx: linkObj.name, title: this.fields.title, text: this.fields.text });
		},
		editCard: function editCard(linkObj) {
			handlers.editCard(linkObj.name);
		}
	};

	events.init();
	window.ddeck = events;
})();
