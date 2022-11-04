const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    tracks: [{
        type: String,
        required: true
    }]
})

const PlaylistDB = mongoose.model('playlistdb', schema);

module.exports = PlaylistDB;