
# Javacript Application Demo
This demo application allows a user to browse, update, add, and delete mini posts (cards) from a database. I've progressively built this application using pure Javascript without a framework or library. This master branch has the lastest stable build, you can see the progression from other branches in this repo. To run the application please follow the instructions below. 

# Goals with v9

1. should have an intermediate confirm dialogue before deleting a card
	* 1a. should have a yes to confirm delete
	* 1b. should have a no to cancel delete
2. should turn instances of mulitple else if statements into object literals to optimize performance and ease of maintenance.
3. should have a fade out sequence of the card confirmed for deletion just before page reloads
	* 3a. should slide card(s) to fill in the gap of the deleted card 
	* 3b. should load previous page after deleting the last card on the page 
4. should experiment implementing a layover for new card
	* status: played with z-layers, position: relative, absolute
5. should experiment a different way to reload images with a 500ms pause in between
	* status: fiddled with it, need to build a listener to trigger the call to loop thru the 3 images on the page
6. should experiment building modules to assemble the application
	* status: may need babel to trans-compile js for import/export to work

## Usage
Simply run

    npm install
    npm start

and access ``http://127.0.0.1:3000/cards`` to get an array of data.

If you want to retrieve just a subset, specify the lower and upper limit as query parameters, for example:

    http://127.0.0.1:3000/cards?_start=8&_end=12
