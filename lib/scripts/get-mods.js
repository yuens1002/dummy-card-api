'use strict';
// calls get-mods.js's getModes function to grab all the modules

(function() {
	let ddeck = {};
	let modules = {};
	function getMods(modName, callback) {
		if (arguments.length > 1) {
			modules[modName] = callback();
		} else {
			return modules[modName];
		}
	}
	ddeck.getMods = getMods;
	window.ddeck = ddeck;
//	ddeck.events.init();
})();
