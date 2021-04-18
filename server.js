const express = require('express');
const path = require('path');
const fs = require('fs');
//set up express
const app = express();
const port = process.env.PORT || 5000;

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
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (error, data) => {
        if (error) {
            throw error;
        }
        console.log(data);

        let parseData = JSON.parse(data);
        return res.json(parseData);

    })
});
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (error, data) => {
        if (error) {
            throw error;
        }

        let parseData = JSON.parse(data);
        console.log(req.body);
        //assign return and parsed data to id based on milliseconds
        req.body.id = Date.now();
        //add to body
        parseData.push(req.body);
        //write to db.json and send response as string
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(parseData), (error) => {
            if (error) {
                throw error;
            }
            return res.json(true);
        })
    });
});

//delete request to db.json using route
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params);
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (error, data) => {
        if (error) {
            throw error;
        }
        let parseData = JSON.parse(data);
        // console.log('This is parseData: ' + parseData);
        //loop through notes and push notes besides ones with id
        let keepNotes = [];
        for (let i = 0; i < parseData.length; i++)
            if (parseData[i].id != req.params.id) {
            keepNotes.push(parseData[i]);
        }
        // console.log('This is keepNotes: ' + keepNotes);
        //rewrite db.json with everything but deleted content
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(keepNotes), (error) => {
            if (error) {
                throw error;
            }
            return res.json(true);
        })
    })
});

//catch
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//listen and confirm port
app.listen(port, () => console.log(`Note Taker app is listening on port ${ port }`));

