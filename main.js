['deck', 'handlers', 'view', 'events'].forEach(
	function(modName) {
		window.ddeck[modName] =
		ddeck.getMods(modName);
	})
ddeck.events.init();
