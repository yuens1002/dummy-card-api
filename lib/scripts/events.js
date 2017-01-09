'use strict';

ddeck.getMods('events', function() {
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
			view.formEventListeners();
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
			handlers.confirmDelete(linkObj.name);
		},
		deleteYes: function(linkObj) {
			handlers.deleteCard(linkObj.name);
		},
		deleteNo: function(linkObj) {
			handlers.cancelDelete(linkObj.name);
		},
		saveEdit: function(linkObj) {
			this.fields.title = document.getElementById(linkObj.name).querySelector('[name="title"]').value;
			this.fields.text = document.getElementById(linkObj.name).querySelector('[name="text"]').value;
			handlers.saveEdit({idx: linkObj.name, title: this.fields.title, text: this.fields.text});
		},
		editCard: function(linkObj) {
			handlers.editCard(linkObj.name);
		}
	};
	return events;
});
