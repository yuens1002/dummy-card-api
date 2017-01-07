# Javacript Application Demo
This demo application allows a user to browse, update, add, and delete mini posts (cards) from a database. I've progressively built this application using pure Javascript without a framework or library. This master branch has the lastest stable build, you can see the progression from other branches in this repo. To run the application please follow the instructions below. 

# Goals with v8

1. Renders fonts accordingly to various page widths
2. Checks for errors before saving user edits
3. Checks the form during new and edit modes before submission

## Usage
Simply run

    npm install
    npm start

and access ``http://127.0.0.1:3000/cards`` to get an array of data.

If you want to retrieve just a subset, specify the lower and upper limit as query parameters, for example:

    http://127.0.0.1:3000/cards?_start=8&_end=12
