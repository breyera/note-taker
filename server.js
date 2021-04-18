const express = require('express');
const path = require('path');
const fs = require('fs');
//set up express
const app = express();
const port = process.env.port || 5000;

//handle data parsing 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//route to html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//api routes 
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            throw error;
        }
        console.log(data);

        let parseData = JSON.parse(data);
        return res.json(parseData);

    })
});

