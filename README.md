# Javacript Application Demo
This demo application allows a user to browse, update, add, and delete mini posts (cards) from a database. I've progressively built this application using pure Javascript without a framework or library. This master branch has the lastest stable build, you can see the progression from other branches in this repo. To run the application please follow the instructions below. 

## Goals with v10

1. done! should use xhr requests instead of fetch
2. should separate modules into different files
3. done! should use babel to trans-compile js files
4. should experiment implementing a layover for new card
	* status: played with z-layers, position: relative, absolute
5. should experiment a different way to reload images with a 500ms pause in between
	* status: fiddled with it, need to build a listener to trigger the call to loop thru the 3 images on the page
6. should take out async functions b/c they're not compatible with safari	

## Usage

Simply run

    npm install
    npm start

and access ``http://127.0.0.1:3000/cards`` to get an array of data.

If you want to retrieve just a subset, specify the lower and upper limit as query parameters, for example:

    http://127.0.0.1:3000/cards?_start=8&_end=12
