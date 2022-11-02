const express = require('express');     //load express
const app = express();                  //create app using express
const path = require("path");
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors')
app.use(cors())

//serving front-end code
app.use('/', express.static('static'));

const trackInfo = [];
const genreInfo = [];
const albumInfo = [];
const artistInfo = [];

function selectFewerGenreProps(show) {
    const { genre_id, title, parent } = show;
    return { genre_id, title, parent };
}

function selectFewerArtistProps(show) {
    const { artist_id, artist_name, artist_bio, artist_active_year_begin, artist_active_year_end, artist_handle, artist_url } = show;
    return { artist_id, artist_name, artist_bio, artist_active_year_begin, artist_active_year_end, artist_handle, artist_url };
}

function selectFewerTrackProps(show) {
    const { track_title, track_genres, track_number, album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration } = show;
    return { track_title, track_genres, track_number, album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration  };
}

// Turns it to an array of objects
fs.createReadStream('lab3-data/genres.csv')
    .pipe(csv())
    .on('data', (rows) => {
        genreInfo.push(rows);
    }).on('end', () => {
        //console.log(genreInfo);
    });

fs.createReadStream('lab3-data/raw_tracks.csv')
    .pipe(csv())
    .on('data', (rows) => {
        trackInfo.push(rows);
    }).on('end', () => {
        //console.log(trackInfo);
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
router.get('/tracks', (req, res) => {
    res.send(trackInfo);
});

// get list of data
router.get('/albums', (req, res) => {
    res.send(albumInfo);
});

// get list of data
router.get('/artists', (req, res) => {
    res.send(artistInfo);
});

app.get('/api/data/genre/:id', (req, res) => {
    var newGenre = genreInfo.map(selectFewerGenreProps)
    const genre = newGenre.find(g => g.genre_id === (req.params.id))
    res.send(genre)
});


app.get('/api/data/album/:id', (req, res) => {

    const album = albumInfo.find(c => c.album_title === req.params.id);
    if (albumInfo) {
        //res.send(album);
        // res.send(`
        // <!DOCTYPE html>
        // <html>
        //     <head>
        //        <link rel="stylesheet" href="stylesheet.css">
        //        <base?>
        //     </head>
        //     <body>
        //         <p>Name: ${album.album_title}</p>
        //         <p>ID: ${album.album_id}</p>
        //         <p>Artist: ${album.artist_name}</p>
        //         <p>Released: ${album.album_date_released}</p>
        //         <p>Listens: ${album.album_listens}</p>                
        //         <p>Website: ${album.album_url}</p>
        //     </body>
        // </html>
        // `)
    } else {
        res.status(404).send('Album was not found!');
    }
    console.log(album)
});

app.get('/api/data/artist/:id', (req, res) => {
    var newArtist = artistInfo.map(selectFewerArtistProps)
    const artist = newArtist.find(a => a.artist_id === (req.params.id))
    if (newArtist) {
        res.send(artist)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(artist)
});

app.get('/api/data/track/:name', (req, res) => {

    var newTrack = trackInfo.map(selectFewerTrackProps)
    const track = newTrack.find(t => t.track_title === (req.params.name))
    if (newTrack) {
        res.send(track)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(track)
});

app.use('/api/data', router)

app.listen(3000, () => console.log('Listening on port 3000...'))

