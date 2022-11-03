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

//arrays to store the csv data in
const trackInfo = [];
const genreInfo = [];
const albumInfo = [];
const artistInfo = [];

//functions to select specific properties
function selectFewerGenreProps(show) {                          
    const { genre_id, title, parent } = show;
    return { genre_id, title, parent };
}

function selectFewerArtistProps(show) {
    const { artist_id, artist_name, artist_bio, artist_active_year_begin, artist_active_year_end, artist_handle, artist_url } = show;
    return { artist_id, artist_name, artist_bio, artist_active_year_begin, artist_active_year_end, artist_handle, artist_url };
}

function selectFewerTrackProps(show) {
    const { track_id, track_title, track_genres, track_number, album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration } = show;
    return { track_id, track_title, track_genres, track_number, album_id, album_title, artist_id, artist_name, tags, track_date_created, track_date_recorded, track_duration };
}

function selectFewerTrackTitleProps(show) {
    const { track_title, track_id } = show;
    return { track_title, track_id };
}

function selectFewerAlbumProps(show) {
    const { album_title, album_id, artist_name, album_date_released, album_listens, album_url } = show;
    return { album_title, album_id, artist_name, album_date_released, album_listens, album_url };
}

function selectFewerAlbumTracksProps(show) {
    const { album_title, track_id } = show;
    return { album_title, track_id };
}


fs.createReadStream('lab3-data/genres.csv')                 //parse genres csv into an object array
    .pipe(csv())
    .on('data', (rows) => {
        genreInfo.push(rows);
    }).on('end', () => {
        //console.log(genreInfo);
    });

fs.createReadStream('lab3-data/raw_tracks.csv')             //parse tracks csv into an object array
    .pipe(csv())
    .on('data', (rows) => {
        trackInfo.push(rows);
    }).on('end', () => {
        //console.log(trackInfo);
    });

fs.createReadStream('lab3-data/raw_albums.csv')             //parse albums csv into an object array
    .pipe(csv())
    .on('data', (rows) => {
        albumInfo.push(rows);
    }).on('end', () => {
        //console.log(albumInfo);
    });

fs.createReadStream('lab3-data/raw_artists.csv')            //parse artist csv into an object array
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

// get list of all genres
router.get('/genres', (req, res) => {
    res.send(genreInfo);
});

// get list of all track
router.get('/tracks', (req, res) => {
    res.send(trackInfo);
});

// get list of all albums
router.get('/albums', (req, res) => {
    res.send(albumInfo);
});

// get list of all artists
router.get('/artists', (req, res) => {
    res.send(artistInfo);
});

//get genre info by genre ID
app.get('/api/data/genres/:id', (req, res) => {
    var newGenre = genreInfo.map(selectFewerGenreProps)
    const genre = newGenre.find(g => g.genre_id === (req.params.id))
    res.send(genre)
});

//get album info by album name
app.get('/api/data/albums/:name', (req, res) => {
    var newAlbum = albumInfo.map(selectFewerAlbumProps)
    const album = newAlbum.find(al => al.album_title === (req.params.name))
    if (newAlbum) {
        res.send(album)
    } else {
        res.status(404).send("Album was not found!");
    }
    console.log(album)

    // const album = albumInfo.find(c => c.album_title === req.params.id);
    // if (albumInfo) {
    //     res.send(album);
    //     res.send(`
    //     <!DOCTYPE html>
    //     <html>
    //         <head>
    //            <link rel="stylesheet" href="stylesheet.css">
    //            <base?>
    //         </head>
    //         <body>
    //             <p>Name: ${album.album_title}</p>
    //             <p>ID: ${album.album_id}</p>
    //             <p>Artist: ${album.artist_name}</p>
    //             <p>Released: ${album.album_date_released}</p>
    //             <p>Listens: ${album.album_listens}</p>                
    //             <p>Website: ${album.album_url}</p>
    //         </body>
    //     </html>
    //     `)
    // } else {
    //     res.status(404).send('Album was not found!');
    // }
    // console.log(album)
});


//get artist info by artist ID
app.get('/api/data/artists/:id', (req, res) => {
    var newArtist = artistInfo.map(selectFewerArtistProps)
    const artist = newArtist.find(a => a.artist_id === (req.params.id))
    if (newArtist) {
        res.send(artist)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(artist)
});


//get track information by track ID
app.get('/api/data/tracks/:id', (req, res) => {
    var newTrack = trackInfo.map(selectFewerTrackProps)
    const track = newTrack.find(t => t.track_id === (req.params.id))
    if (newTrack) {
        res.send(track)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(track)
});


//get tracks IDs from track title
app.get('/api/data/tracks-title/:name', (req, res) => {
    var newTrack = trackInfo.map(selectFewerTrackTitleProps)
    const track = newTrack.filter(t => t.track_title.toLowerCase() === (req.params.name.toLowerCase())).slice(0, 11)
    if (newTrack) {
        res.send(track)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(track)
});


//get track IDs from album title
app.get('/api/data/albums-title/:name', (req, res) => {
    var tracksFromAlbum = trackInfo.map(selectFewerAlbumTracksProps)
    const tracks = tracksFromAlbum.filter(a => a.album_title.toLowerCase() === (req.params.name.toLowerCase())).slice(0, 11)
    if (tracksFromAlbum) {
        res.send(tracks)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(tracks)
});

app.use('/api/data', router)

app.listen(3000, () => console.log('Listening on port 3000...'))