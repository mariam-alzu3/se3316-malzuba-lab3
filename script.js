const express = require('express');
const app = express();
const path = require("path");
const fs = require('fs');
const router = express.Router();
//const csv = require('csv-parser');

//serving front-end code
app.use('/', express.static('static'));


const data = [
    {genre_id: 1, name: "pop"},
    {genre_id: 2, name: "rock"}
];

// middleware to do logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// get list of data
router.get('/', (req, res) => {
    res.send(data);
});

// data based on id
router.get('/:genre_id', (req, res) => {
    const genre = data.find(c => c.genre_id === parseInt(req.params.genre_id));
    res.send(genre);
    console.log(genre)
});

app.use('/api/data', router)

app.listen(3000, () => console.log('Listening on port 3000...'))

