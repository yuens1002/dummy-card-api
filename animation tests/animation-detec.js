// set the var here


document.querySelector('button').onclick = function() {
	let elmLi = '',
		elmDiv = document.querySelector('.container'),
		elmPlay = document.createElement('div');
	
		
		
  	for (var i = 0; i < 3; i++) {
		elmLi = document.createElement('li');
		elmLi.setAttribute('class', 'child');
		elmLi.innerHTML = i+1;
	  	elmDiv.appendChild(elmLi);
		var playTiles = document.getElementsByTagName("li");
		
		if (i === 2) {
		playTiles[i].addEventListener("animationend",function(e){
			document.querySelector('.play').classList.add('animate');
			document.querySelector('.play').innerHTML = 
				'<img src="http://lorempixel.com/300/150/">';
				
		},false);}
		// listen for animation start
		playTiles[i].addEventListener("animationstart",function(e){
			console.log("log at beginning of monkey animation");
		},false);

		// listen for animation iteration
//		playTiles[i].addEventListener("animationiteration",function(e){
//			console.log("log at beginning of each subsequent iteration");
//		},false);
		
		elmDiv.children[i].classList.add('TranMove');
		
  	}
}

function test(obj) {
	obj.name;
}

function cancelEdit(obj) {
	console.log(obj.name);
}

