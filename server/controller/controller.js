var PlaylistDB = require('../model/model')

// create and save new user
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }

    // new playlist
    const playlist = new PlaylistDB({
        name: req.body.name,
        //tracks: [req.body.tracks]
        tracks: req.body.tracks
    })

    playlist
        .save(playlist)
        .then(data => {
            res.send(data)
            //res.redirect('/add-user');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}
