# Javacript Application Demo
This demo application allows a user to browse, update, add, and delete mini posts (cards) from a restfulAPI endpoint. I've progressively built this application using pure Javascript without a framework or library. This master branch has the lastest stable build, you can see the progression from other branches in this repo. To run the application please follow the instructions below. 

## Goals with v10

1. done! should use xhr requests instead of fetch
2. should separate modules into different files
3. done! should use babel to trans-compile js files
4. should experiment implementing a layover for new card
	* status: played with z-layers, position: relative, absolute
5. should experiment a different way to reload images with a 500ms pause in between
	* status: fiddled with it, need to build a listener to trigger the call to loop thru the 3 images on the page
6. should take out async functions b/c they're not compatible with safari	

## Run the App

1. Download, Clone, or Fork project
2. Cd to project directory
3. Type the following commands in terminal 
    ```
    npm install
    npm start
    ```
4. Open index.html using any browser
