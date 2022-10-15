const express = require('express');
const app = express();
const path = require("path");


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/javascript", (req, res) => {
    res.sendFile(path.join(__dirname, "/script.js"))
});

app.get("/css", (req, res) => {
    res.sendFile(path.join(__dirname, "/stylesheet.css"))
});

const data = [];
const fs = require('fs');
const csv = require('csv-parser');


fs.createReadStream('lab3-data/genres.csv')
    .pipe(csv())
    .on('data', (rows) => {
        data.push(rows);
    }).on('end', () => {
        //console.log(data);
    });

app.get('/api/data', (req, res) => {
    res.send(data);
});

app.get('/api/data/:genre_id', (req, res) => {
    const genre = data.find(c => c.genre_id === (req.params.genre_id));
    res.send(genre);
    console.log(genre)
});


app.listen(3000, () => console.log('Listening on port 3000...'))

