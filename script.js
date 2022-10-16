const express = require('express');
const app = express();
const path = require("path");
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');

//serving front-end code
app.use('/', express.static('static'));


const data = [];


// Turns it to an array of objects
fs.createReadStream('lab3-data/genres.csv')
    .pipe(csv())
    .on('data', (rows) => {
        data.push(rows);
    }).on('end', () => {
        //console.log(data);
    });

// Turns it to an array
// var stream = require("fs").createReadStream("lab3-data/genres.csv")
// var reader = require("readline").createInterface({ input: stream })
// var arr = []
// reader.on("line", (row) => { 
//     data.push(row.split(",")) 
//     console.log(data)
// });

// middleware to do logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// get list of data
router.get('/', (req, res) => {
    res.send(data);
});

// data based on id (with params)
// router.get('/:key', (req, res) => {
//     var searchTerm = req.query.searchterm;
//     console.log(searchTerm);
    
//     const name = req.params.key;
//     const genre = data.find(c => c.title === name);
    
//     //const genre = data.find(c => c.title === (req.params.title));
//     if (data) {
//         res.send(genre);
//     } else {
//         res.status(404).send(`Genre was not found!`);
//     }
//     console.log(genre)
// });

app.get('/api/data/search', (req, res) => {
    var searchTerm = req.query.searchterm;
    console.log(searchTerm);
    
    const genre = data.find(c => c.title === searchTerm);
        if (data) {
        res.send(genre);
    } else {
        res.status(404).send(`${searchTerm} was not found!`);
    }
    console.log(genre)
});

app.use('/api/data', router)

app.listen(3000, () => console.log('Listening on port 3000...'))

