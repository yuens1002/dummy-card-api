// formCheck function call will provide a formFields Object from either add card or edit card

formCheck function(formFields) {
		
//	check to see which argument in FormCheck is valid
//	use a for in loop to check validity of the data and assign a unique case name for processing
//	
//	if all fields are valid save form data if not, find out which isnt and process them
	
	let numValidVal = 0;
	let newCard = {
		title: function() {
				
		},
		text: function() {
			
		},
		author: function() {
			
		}	
	};
	let editCard = {
		title: function() {
				
		},
		text: function() {
			
		}
	};

	function processForm (formType) {
			for (let key in formFields) {
			!!formFields[key] ? numValidVal++ : formType[key]();
		}
	}

	if (currentMode === deck.modes.edit) {
		processForm(editCard);
		numValidVal === formFields.length && deck.saveEdit;
	} else {
		processForm(newCard);
		numValidVal === formFields.length && deck.saveNew;
	}

}

function formCheck(formFields) {
    
    let newCard = {
		title: function() {
			console.log('NewCard title is called')	
		},
		text: function() {
			console.log('NewCard text is called')
		},
		author: function() {
			console.log('NewCard author is called')
		},
        processForm: function () {
            for (let key in formFields) {
              !(!!formFields[key]) && this[key]();
            }
        }
	};
	let editCard = {
		title: function() {
			console.log('Edited title is called')	
		},
		text: function() {
			console.log('Edited text is called')	
		},
        processForm: function () {
            for (let key in formFields) {
              !(!!formFields[key]) && this[key]();
            }
        }
	};
  
    function processForm (formType) {
        for (let key in formFields) {
                !!!formFields[key] && formType[key]();
        }
    }
  
    processForm(newCard);
}

formCheck({title: '', text: 'hello', author: 'tom'});