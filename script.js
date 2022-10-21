const express = require('express');     //load express
const app = express();                  //create app using express
const path = require("path");
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');

//serving front-end code
app.use('/', express.static('static'));


const genreInfo = [];
const albumInfo = [];
const artistInfo = [];


// Turns it to an array of objects
fs.createReadStream('lab3-data/genres.csv')
    .pipe(csv())
    .on('data', (rows) => {
        genreInfo.push(rows);
    }).on('end', () => {
        //console.log(genreInfo);
    });

fs.createReadStream('lab3-data/raw_albums.csv')
    .pipe(csv())
    .on('data', (rows) => {
        albumInfo.push(rows);
    }).on('end', () => {
        //console.log(albumInfo);
    });

fs.createReadStream('lab3-data/raw_artists.csv')
    .pipe(csv())
    .on('data', (rows) => {
        artistInfo.push(rows);
    }).on('end', () => {
        console.log(artistInfo);
    });

// middleware to do logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// get list of data
router.get('/genres', (req, res) => {
    res.send(genreInfo);
});

// get list of data
router.get('/albums', (req, res) => {
    res.send(albumInfo);
});

// get list of data
router.get('/artists', (req, res) => {
    res.send(artistInfo);
});


app.get('/api/data/genre', (req, res) => {
    var searchTerm = req.query.searchterm;
    console.log(searchTerm);

    const genre = genreInfo.find(c => c.title === searchTerm);
    if (genreInfo) {
        res.send(genre);
    } else {
        res.status(404).send(`${searchTerm} was not found!`);
    }
    console.log(genre)
});


app.get('/api/data/album', (req, res) => {
    var searchTerm = req.query.searchterm2;
    console.log(searchTerm);

    const album = albumInfo.find(c => c.album_title === searchTerm);
    if (albumInfo) {
        res.send(album);
    } else {
        res.status(404).send(`${searchTerm} was not found!`);
    }
    console.log(album)
});

app.get('/api/data/artist', (req, res) => {
    var searchTerm = req.query.searchterm3;
    console.log(searchTerm);

    const artist = artistInfo.find(c => c.artist_name === searchTerm);
    if (albumInfo) {
        res.send(artist.artist_id);
    } else {
        res.status(404).send(`${searchTerm} was not found!`);
    }
    console.log(artist)
});

app.use('/api/data', router)

app.listen(3000, () => console.log('Listening on port 3000...'))

