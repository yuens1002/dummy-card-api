"use strict";

ddeck.getMods('view', function() {
	let view = {
		cardsPerPage: 3,
		currentPage: 1,
		currentMode: ddeck.deck.modes.view,
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
			// needs to edit
			get deleteYes() {
				this.makeLink(this.links.menu.edit.delete.yes.text, {
					href: '#',
					name: this.idx,
					onclick: this.onclickValue(this.links.menu.edit.delete.yes.fnName)
				});
				return this.elmLi;
			}
			// needs to edit
			get deleteNo() {
				this.makeLink(this.links.menu.edit.delete.no.text, {
					href: '#',
					name: this.idx,
					onclick: this.onclickValue(this.links.menu.edit.delete.no.fnName)
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
			labelTitle.innerHTML = deck.form.label.title.default;
			let inputTitle = document.createElement('input');
			inputTitle.setAttribute('type', 'text');
			inputTitle.setAttribute('name', 'title');
			inputTitle.placeholder = deck.form.placeholder.title;
			inputTitle.size = 32;

			let labelText = document.createElement('label');
			labelText.innerHTML = deck.form.label.text.default;
			let areaText = document.createElement('textarea');
			areaText.setAttribute('name', 'text');
			areaText.placeholder = deck.form.placeholder.text;

			let labelAuthor = document.createElement('label');
			labelAuthor.innerHTML = deck.form.label.author.default;
			let inputAuthor = document.createElement('input');
			inputAuthor.setAttribute('type', 'text');
			inputAuthor.setAttribute('name', 'author');
			inputAuthor.placeholder = deck.form.placeholder.author;

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
		createCardActionLinks: function(name, idx) {
			let elmUlLinks = document.createElement('ul'),
				types = {
					editDel: function() {
						elmUlLinks.setAttribute('class', 'hide-card-links');
						elmUlLinks.appendChild(new this.CreateLinkElm(idx).editCard);
						elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteCard);
					},
					editDelVisible: function() {
						elmUlLinks.appendChild(new this.CreateLinkElm(idx).editCard);
						elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteCard);
					},
					cancelSave: function() {
						elmUlLinks.appendChild(new this.CreateLinkElm(idx).cancelEdit);
						elmUlLinks.appendChild(new this.CreateLinkElm(idx).saveEdit);
					},
					newCard: function() {
						elmUlLinks.appendChild(new this.CreateLinkElm().saveNew);
					},
					yesNo: function() {
						let elmP = document.createElement('p');
						// need to grab the text here an obj model
						elmP.innerHTML= 'Are you Sure? Choose Yes to confirm delete or No to cancel'
						elmUlLinks.appendChild(elmP);
						elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteNo);
						elmUlLinks.appendChild(new this.CreateLinkElm(idx).deleteYes);
					}
				};
			types[name].call(this);
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
	//	showCards: async function (page, mode) {
	//		let eleMain = document.querySelector('#main');
	//		let takeNap = deck.takeNap;
	//		eleMain.innerHTML = '';
	//		for (let i = (page - 1) * this.cardsPerPage; i < (page * this.cardsPerPage); i++) {
	//    		if (deck.cards[i]) {
	//				eleMain.appendChild(this.makeCard(i,'editDel'));
	//				if (i === (page * this.cardsPerPage)-1) {
	//					await takeNap(2000);
	//					console.log('took a sec');
	////					document.getElementById((page * this.cardsPerPage)-1)
	////					.addEventListener('animationend', pause, false);
	////				}
	////				function pause() {
	////					let elmImgs = document.querySelectorAll('img');
	////					for (let j = 0; j < 3; j++) {
	////						await takeNap(500);
	////						let k = 0;
	////						let elmImgNew = document.createElement('img');
	////						elmImgNew.setAttribute('src', deck.cards[j].image_url);
	////						document.getElementById(page-1).querySelector('.child')
	////							.replaceChild(elmImgNew, elmImgs[k]);
	////						k++;
	////
	////					}
	//				}
	//				eleMain.lastChild.classList.add('moveRTL');
	//
	////				await deck.takeNap(400);
	//				if (mode === deck.modes['edit']) {
	//					document.querySelector('.hide-card-links')
	//					.removeAttribute('class');
	//				}
	//			}
	//		}
	//	},
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
			if (mode === deck.modes.new) {
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
		showNextLink: function(page) {
			(page === deck.getNumPages()) ?
				document.querySelector('#next-link').style.visibility = "hidden" :
				document.querySelector('#next-link').removeAttribute('style')
		},
		showEditInputs: function(node, eleActions, eleTitle, eleText, eleAuthor, idx) {
			let inputTitle = document.createElement('input');
			inputTitle.setAttribute('type', 'text');
			inputTitle.setAttribute('name', 'title');
			inputTitle.setAttribute('placeholder', deck.form.placeholder.title);
			let areaText = document.createElement('textarea');
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
		showDeleteConfirmation: function(idx) {
			let node = document.getElementById(idx)
				.querySelector('.child-inner');
			node.replaceChild(this.createCardActionLinks('yesNo', idx), node.firstChild);
		},
		formEventListeners: function(toStop) {
			let elmTitleInput = document.querySelector('[name="title"]'),
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
				switch(field.target.name) {
					case 'title':
						!field.target.value ?
						elmTitleLabel.innerHTML =
							deck.form.label.title.default + deck.form.label.required :
						elmTitleLabel.innerHTML =
							deck.form.label.title.feedback;
						break;
					case 'text':
						!field.target.value ?
						elmTextLabel.innerHTML =
							deck.form.label.text.default + deck.form.label.required :
						elmTextLabel.innerHTML =
							deck.form.label.text.feedback;
						break;
					case 'author':
						!field.target.value ?
						elmAuthorLabel.innerHTML =
							deck.form.label.text.default + deck.form.label.required :
						elmAuthorLabel.innerHTML =
							deck.form.label.author.feedback;
						break;
				}
			}
		},
		editFormListeners: function(idx, addRemoveSwitch) {
			let input = document.getElementById(idx).querySelector('input');
			let textArea = document.getElementById(idx).querySelector('textarea');

			if (addRemoveSwitch === 'on') {
				input.addEventListener('blur', function setAttr() {
				this.value === '' && this.setAttribute('placeholder',
				deck.form.label.title.default + deck.form.label.required);
				}, false);
			} else {
				input.removeEventListener('blur', function setAttr() {
				this.value === '' && this.setAttribute('placeholder',
				deck.form.label.title.default + deck.form.label.required);
				}, false);
	//			console.log('listener is off');
			}

			if (addRemoveSwitch === 'on') {
				textArea.addEventListener('blur', function setAttr() {
				this.value === '' && this.setAttribute('placeholder',
				deck.form.label.text.default + deck.form.label.required);
				}, false);
			} else {
				textArea.removeEventListener('blur', function setAttr() {
				this.value === '' && this.setAttribute('placeholder',
				deck.form.label.text.default + deck.form.label.required);
				}, false);
	//			console.log('listener is off');
			}
		}
	};
	return view;
});
