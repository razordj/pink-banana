const db = require("../../db");

const Upload = db.Upload;

exports.create = (req, res) => {
    const upload = new Upload({
        address: req.body.address,
        itemName: req.body.itemName,
        itemDesc: req.body.itemDesc,
        royalties: req.body.royalties,
        itemsize: req.body.itemsize,
        itemProperty: req.body.itemProperty,
        price: req.body.price,
        looking: req.body.looking,
        hashValue: req.body.hashValue       
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

exports.findAll = (req, res) => {
    var condition = {}

    Upload.find(condition)
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

// exports.findMyAllNFTs = (req, res) => {
//     const useraddress = req.query.useraddress;
//     var condition = { useaddress: {$regex: new RegExp(address), $options: "i"}}

//     Upload.find(condition)
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occured while retrieving tutorials."
//             })
//         });
// }

exports.findOne = (req, res) => {
    const id = req.params.id;
    
    Upload.findById(id)
        .then(data => {
            if(!data)
                res.status(404).send({message: "Not found User with id " + id});
            else res.send(data)
        })
        .catch(err => {
            res.status(500)
            .send({message: "Error retrieving User with id = " + id});
        })
}

exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        })
    }

    const id = req.params.id;

    Upload.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data) {
                res.status(404).send({
                    message: `Cannot update User with id = ${id}. Maybe User was not found.`
                });
            } else res.send({ message: "User was updated successfully" });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id = " + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Users.findByIdAndRemove(id)
        .then(data => {
            if(!data) {
                res.status(404).send({
                    message: `Cannot delete User with id = ${id}. Maybe User was not found.`
                });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id = " + id
            });
        })
}

exports.deleteAll = (req, res) => {
    Users.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Users were deleted succesfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Users."
            });
        });
}