'use strict';

ddeck.getMods('handlers', function() {
	let handlers = {
		switchMode: function(page, mode) {
			deck.setMode(mode);
			mode === deck.modes.new ? view.showNewPage(mode) : view.showPage(page, mode)
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
			//turns the listener with the the spec idx off
			view.editFormListeners(idx, 'off');
			view.showCard(idx, 'editDel');
		},
		saveEdit: function(fields) {
			deck.checkForm(fields);
	//		let cardId = deck.cards[idx].id;
	//		deck.editCard(cardId, title, text, idx);
		},
	//	cancelNewCard: function(idx) {
	//		deck.deleteCard(0, idx, true);
	//		view.showPage(1);
	//	},
		saveNewCard: function(fields) {
			deck.checkForm(fields);
	//		deck.addCard(title, text, author);
		},
		//rename to something else
		confirmDelete: function(idx) {
			view.showDeleteConfirmation(idx);
		},
		//rename to something else
		cancelDelete: function(idx) {
			let node = document.getElementById(idx).querySelector('.child-inner');
			node.replaceChild(view.createCardActionLinks('editDelVisible', idx), node.firstChild);
		}
	};
	return handlers;
});
