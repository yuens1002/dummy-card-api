//let 
//
//let controller = function () {
//	let	button = document.querySelector('button'),
//		container = documnet.getElementsByClassName('container')[0];
//	if (button.innerHTML === 'play') {
//		button.innerHTML === 'pause';
//		button.classList.add('move');
//	} else {
//		button.innerHTML === 'play';
//		let computerStyle = window.getComputedStyle(sqt[i])
//	}
//	
//}

//let test = {
//	ElmLi: class {
//		constructor(elm) {
//			this.li = elm;
//		}
//		get madedLi() {
//			return 
//		}
//	},
//	
//}


document.querySelector('button').onclick = function() {
	let elmLi = '',
		elmDiv = document.querySelector('.container'),
		elmPlay = document.createElement('div'),
		numLi = 3;
	
		document.querySelector('.play').classList.add('animate');
	
  	for (let i = 0; i < numLi; i++) {
		elmLi = document.createElement('li');
		elmLi.setAttribute('class', 'child');
		elmLi.innerHTML = i+1;
	  	elmDiv.appendChild(elmLi);
	 	elmDiv.children[i].classList.add('TranMove');
  	}
}



/*
document.getElementsByClassName('toggleButton')[0].onclick = function() {
  if(this.innerHTML === 'Play') 
  { 
    this.innerHTML = 'Pause';
    boxOne.classList.add('horizTranslate');
  } else {
    this.innerHTML = 'Play';
    var computedStyle = window.getComputedStyle(boxOne),
        marginLeft = computedStyle.getPropertyValue('margin-left');
    boxOne.style.marginLeft = marginLeft;
    boxOne.classList.remove('horizTranslate');    
  }  
}
*/