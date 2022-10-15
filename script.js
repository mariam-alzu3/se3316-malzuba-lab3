const express = require('express');
const app = express();
const path = require("path");

//serving front-end code
app.use('/', express.static('static'));



//const data = [];
const fs = require('fs');
//const csv = require('csv-parser');



app.get('/api/data', (req, res) => {
    res.send(data);
});

app.get('/api/data/:genre_id', (req, res) => {
    const genre = data.find(c => c.genre_id === (req.params.genre_id));
    res.send(genre);
    console.log(genre)
});


app.listen(3000, () => console.log('Listening on port 3000...'))

