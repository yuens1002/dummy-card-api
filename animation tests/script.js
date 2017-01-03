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

console.log(document.querySelector('[name="title"]').value);


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

function test(obj) {
	obj.name;
}

function cancelEdit(obj) {
	console.log(obj.name);
}



//class Animal { 
//  constructor(name) {
//    this.name = name;
//  }
//  
//  speak() {
//    console.log(this.name + ' makes a noise.');
//  }
//}

//	type of links
//	if type is edit make links with either cancel or save
//	if type is new make link with save
//	if type is mode make view, add new or edit
//	if type is control make prev or next


/*

<a href="#" onclick="cancel(this);return false;"></a>

*/

let view = {
	
	listners: function () {
		let elmBody = document.body;
		elmBody.addEventListener('mouseover', function(event) {
			let elmClicked = event.target;
			if (elmClicked.id === 'new-card') {
				window.status = 'new card function will tricker';
			}
		});
		
		
	},
	buttonEvents: {
		newCard: function() {
			console.log('you clicked new');
		}
	}
}

view.listners();

class CreateLinkElm {
	constructor(idx) {
		this.idx = idx;
		this.elmA = document.createElement('a');
		this.fnPath = 'view.buttonEvents.',
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
						fnName: 'delete',
						text: '✕ Delete'
					},
					save: {
						fnName: 'saveEdit',
						text: '✓ Save'
					}
				}
			}
		};
	}
	get prev() {
		this.makeLink(this.links.control.prev.text, {
			href: '#',
			onclick: this.onclickValue(this.links.control.prev.fnName,0)
		});
		return this.elmA;
	}
	get next() {
		this.makeLink(this.links.control.next.text, {
			href: '#',
			onclick: this.onclickValue(this.links.control.next.fnName,0)
		});
		return this.elmA;
	}
	get view() {
		this.makeLink(this.links.menu.view.text, {
			href: '#',
			onclick: this.onclickValue(this.links.menu.view.fnName,0)
		});
		return this.elmA;
	}
	get newCard() {
		this.makeLink(this.links.menu.new.text, {
			href: '#',
			id: 'new-card',
			onclick: this.onclickValue(this.links.menu.new.fnName,0)
		});
		return this.elmA;
	}
	get saveNew() {
		this.makeLink(this.links.menu.new.save.text, {
			href: '#',
			onclick: this.onclickValue(this.links.menu.new.save.fnName,0)
		});
		return this.elmA;
	}
	get edit() {
		this.makeLink(this.links.menu.edit.text, {
			href: '#',
			onclick: this.onclickValue(this.links.menu.edit.fnName,0)
		});
		return this.elmA;
	}
	get cancelEdit() {
		this.makeLink(this.links.menu.edit.cancel.text, {
			href: '#', 
			name: this.idx, 
			onclick: this.onclickValue(this.links.menu.edit.cancel.fnName)
		});
		return this.elmA;
	}
	get delete() {
		this.makeLink(this.links.menu.edit.delete.text, {
			href: '#',
			name: this.idx,
			onclick: this.onclickValue(this.links.menu.edit.delete.fnName)
		});
		return this.elmA;
	}
	get saveEdit() {
		this.makeLink(this.links.menu.edit.save.text, {
			href: '#',
			name: this.idx,
			onclick: this.onclickValue(this.links.menu.edit.save.fnName)
		});
		return this.elmA;
	}
	onclickValue(fnName) {
		return (arguments.length > 1 ?
			this.fnPath+fnName+'();return false;' : this.fnPath+fnName+'(this);return false;');
	}
	makeLink(text, attrs) {
		for(var key in attrs) {
    		this.elmA.setAttribute(key, attrs[key]);
  		}
		this.elmA.innerHTML = text;
	}
}

function createActionLinks(idx) {
	document.body.insertBefore(new CreateLinkElm(idx).prev, document.body.firstChild);
	document.body.insertBefore(document.createElement('br'), document.body.firstChild);
	document.body.insertBefore(new CreateLinkElm(idx).next, document.body.firstChild);
	document.body.insertBefore(document.createElement('br'), document.body.firstChild);
	document.body.insertBefore(new CreateLinkElm(idx).view, document.body.firstChild);
	document.body.insertBefore(document.createElement('br'), document.body.firstChild);
	document.body.insertBefore(new CreateLinkElm(idx).newCard, document.body.firstChild);
	document.body.insertBefore(document.createElement('br'), document.body.firstChild);
	document.body.insertBefore(new CreateLinkElm(idx).saveNew, document.body.firstChild);
	document.body.insertBefore(document.createElement('br'), document.body.firstChild);
	document.body.insertBefore(new CreateLinkElm(idx).edit, document.body.firstChild);
	document.body.insertBefore(document.createElement('br'), document.body.firstChild);
	document.body.insertBefore(new CreateLinkElm(idx).cancelEdit, document.body.firstChild);
	document.body.insertBefore(document.createElement('br'), document.body.firstChild);
	document.body.insertBefore(new CreateLinkElm(idx).delete, document.body.firstChild);
	document.body.insertBefore(document.createElement('br'), document.body.firstChild);
	document.body.insertBefore(new CreateLinkElm(idx).saveEdit, document.body.firstChild);
}

createActionLinks(11);


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


//		
//		
//		function inMsg (event) {	
//			let formFieldOnBlur = event.target,
//				elmTitleInput = document.getElementsByTagName('label')[0],
//				elmTextInput = document.getElementsByTagName('label')[1],
//				elmAuthorInput = document.getElementsByTagName('label')[2];
//				concole.log(formFieldOnBlur);
//			
//				formFieldOnBlur.name === 'title' && !elmTitleInput.innerHTML ?
//				elmTitleInput.innerHTML = 'Title is Required' :
//				elmTitleInput.innerHTML = 'Awesome!';
//			
//				formFieldOnBlur.name === 'text' && !elmTextInput.innerHTML ?
//				elmTextInput.innerHTML = 'Paragraph is Required' :
//				elmTextInput.innerHTML = 'Oohley smokes... one more to go!';
//			
//				formFieldOnBlur.name === 'author' && !elmAuthorInput.innerHTML ?
//				elmAuthorInput.innerHTML = 'Name or Handle is Required' :
//				elmAuthorInput.innerHTML = 'You\'re Cool!';
//			
//			
//				} else {
//					document.getElementsByTagName('label')[0].innerHTML = 'Title';
//				}
//			} 
//				else if (formFieldKeyUp.name === 'text') {
//				document.getElementsByTagName('label')[1].innerHTML = 'Oohley smokes... one more to go!';
//			} else {
//				document.getElementsByTagName('label')[2].innerHTML = 'You\'re Cool!';
//			}
	
		
		
//		let titleLabel = document.getElementsByTagName('label')[0];
//		let fieldTitle = document.querySelector('[name="title"]');
//		fieldTitle.addEventListener('blur', msg, this, false);
//		
//		function msg(field) {
//			console.log(field);
//				!field.target.value ? 
//				titleLabel.innerHTML = 'Title is Required' :
//				titleLabel.innerHTML = 'Awesome!';
//		}
//		
//	}
		