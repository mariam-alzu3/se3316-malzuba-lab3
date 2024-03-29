const express = require('express');     //load express
const app = express();                  //create app using express
const path = require("path");
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const Joi = require('joi');
const cors = require('cors');
const { parse } = require('path');
app.use(cors())
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./server/database/connection');
dotenv.config({ path: 'config.env' })
app.use(bodyParser.json());


//serving front-end code
app.use('/', express.static('static'));

//arrays to store the csv data in
const trackInfo = [];
const genreInfo = [];
const albumInfo = [];
const artistInfo = [];
const playlists = [
    { name: "test", tracks: ["20", "2"] }
];

connectDB(); //connects to mongodb


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

//parse data in body as JSON
router.use(express.json());

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

//1. get genre info by genre ID
app.get('/api/data/genres/:id([0-9]{1}|[0-9]{2}|[0-9]{3}|[0-9]{4})', (req, res) => {
    var newGenre = genreInfo.map(selectFewerGenreProps)
    const genre = newGenre.find(g => g.genre_id === (req.params.id))
    res.send(genre)
});


//2. get artist info by artist ID
app.get('/api/data/artists/:id([0-9]{1}|[0-9]{2}|[0-9]{3}|[0-9]{4}|[0-9]{5})', (req, res) => {
    var newArtist = artistInfo.map(selectFewerArtistProps)
    const artist = newArtist.find(a => a.artist_id === (req.params.id))
    if (newArtist) {
        res.send(artist)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(artist)
});


//3. get track information by track ID
app.get('/api/data/tracks/:id([0-9]{1}|[0-9]{2}|[0-9]{3}|[0-9]{4}|[0-9]{5}|[0-9]{6})', (req, res) => {
    var newTrack = trackInfo.map(selectFewerTrackProps)
    const track = newTrack.find(t => t.track_id === (req.params.id))
    if (newTrack) {
        res.send(track)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(track)
});

//4. get album info by album name
app.get('/api/data/albums/:name([a-zA-Z]+)', (req, res) => {
    var newAlbum = albumInfo.map(selectFewerAlbumProps)
    const album = newAlbum.find(al => al.album_title === (req.params.name))
    if (newAlbum) {
        res.send(album)
    } else {
        res.status(404).send("Album was not found!");
    }
    console.log(album)
});


//4. get tracks IDs from track title
app.get('/api/data/tracks-title/:name([0-9a-zA-Z]+)', (req, res) => {
    var newTrack = trackInfo.map(selectFewerTrackTitleProps)
    const track = newTrack.filter(t => t.track_title.toLowerCase() === (req.params.name.toLowerCase())).slice(0, 11)
    //const {track_title, ...rest} = track;

    if (newTrack) {
        res.send(track)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(track)
});


//4. get track IDs from album title
app.get('/api/data/albums-title/:name([0-9a-zA-Z]+)', (req, res) => {
    var tracksFromAlbum = trackInfo.map(selectFewerAlbumTracksProps)
    const tracks = tracksFromAlbum.filter(a => a.album_title.toLowerCase() === (req.params.name.toLowerCase())).slice(0, 11)
    if (tracksFromAlbum) {
        res.send(tracks)
    } else {
        res.status(404).send("Given ID was not found!");
    }
    console.log(tracks)
});


//5. artists IDs from artist name
app.get('/api/data/artist-name/:name([0-9a-zA-Z]+)', (req, res) => {
    var newArtistArr = artistInfo.map((data) => {
        return {
            'artist_name': data.artist_name,
            'artist_id': data.artist_id
        }
    });

    const artistIDs = newArtistArr.filter(a => a.artist_name.toLowerCase() === req.params.name.toLowerCase());

    if (artistIDs) {
        res.send(artistIDs);
    } else {
        res.status(404).send(`Artist "${req.params.name}" was not found!`);
    }
    console.log(artistIDs);
});

// CRUD
var PlaylistDB = require('./server/model/model')

// CREATE
router.post('/playlist', (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    //input sanitization
    const schema = Joi.object({
        name: Joi.string().regex(/^[a-zA-Z0-9_.-]*$/)
            .min(3)
            .max(30)
            .required(),

        tracks: Joi.array().items(Joi.string()
            .min(1)
            .required()
        )
    });

    const result = schema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // new playlist
    const playlist = new PlaylistDB({
        name: req.body.name,
        tracks: req.body.tracks
    })

    playlist
        .save(playlist)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
})

//FIND
router.get('/playlist', (req, res) => {
    if (!req.query.name) {
        PlaylistDB.find()
            .then(playlist => {
                playlist.forEach(e => {
                    numOfTracks = e.tracks.length;
                    console.log(numOfTracks)
                })
                res.send(playlist)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
            })
        //return res.status(400).send('Missing URL parameter: name')
    } else {

        PlaylistDB.findOne({
            name: req.query.name
        })
            .then(doc => {
                res.json(doc)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
})


// UPDATE
router.put('/playlist/:name([0-9a-zA-Z]+)', (req, res) => {
    if (!req.params.name) {
        return res.status(400).send('Missing URL parameter: name')
    } else if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    if (!req.body) {
        res.send({ message: 'Cannot be empty!' })
    }

    //input sanitization
    const schema = Joi.object({
        tracks: Joi.array().items(Joi.string()
            .min(1)
            .required()
            .regex(/^[0-9]*$/)
        )
    });

    const result = schema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    PlaylistDB.findOneAndUpdate({
        name: req.params.name
    }, req.body, {
        new: true
    })
        .then(doc => {
            if (!doc) {
                res.status(404).send({ message: `Playlist does not exist!` })
            } else {
                res.json(doc)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

// DELETE
router.delete('/playlist/:name([0-9a-zA-Z]+)', (req, res) => {
    if (!req.params.name) {
        return res.status(400).send('Missing URL parameter: name')
    }

    PlaylistDB.findOneAndRemove({
        name: req.params.name
    })
        .then(doc => {
            if (!doc) {
                res.status(404).send({ message: `Playlist does not exist!` })
            } else {
                res.json(doc)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

app.use('/api/data', router)

app.listen(3000, () => console.log('Listening on port 3000...'))