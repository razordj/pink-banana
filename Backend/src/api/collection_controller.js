const db = require("../../db");

const Collection = db.Collection;

exports.create = (req, res) => {

    const url = req.protocol + '://' + req.get('host');
    const upload = new Collection({
        name: req.body.name,
        image: url + '/' + req.file.filename,
        description: req.body.description,
        author: req.body.author
    });

    upload
        .save(upload)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while uploading arts."
            })
        });

}


exports.getAll = (req, res) => {
    var condition = {};

    Collection.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving tutorials."
            })
        });
};

exports.findOne = (req, res) => {
    var condition = { name: req.body.name };
    Collection.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving tutorials."
            })
        });
}