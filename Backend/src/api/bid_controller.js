const db = require("../../db");

const Bid = db.Bid;

exports.create = (req, res) => {
    const newBid = new Bid({
        nftId: req.body.nftId,
        bidNum: req.body.bidNum,
        bidPrice: req.body.bidPrice,
        bidAddress: req.body.bidAddress,
        bidApprove: false,
        bidApprovePrice: 0,
    });

    newBid
        .save(newBid)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while uploading bid."
            })
        });
}

exports.findAll = (req, res) => {
    var condition = {}

    Bid.find(condition)
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


exports.findOne = (req, res) => {
    const id = req.body.nftId;
    Bid.find({ nftId : id })
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

    const id = req.body.id;
    const price = req.body.price;

    Bid.findByIdAndUpdate(id, {
        bidApprove : true, 
        bidApprovePrice: price
    }, {useFindAndModify: false})
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
    if(!req.body){
        return res.status(400).send({
            message: "Data to update can not be empty!"
        })
    }
    const nftId = req.body.nftId;

    Bid.deleteMany({nftId: nftId})
        .then(data => {
            if(!data) {
                res.status(404).send({
                    message: `Cannot delete User with id = ${id}. Maybe User was not found.`
                });
            } else {
                console.log(data);
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
    Bid.deleteMany({})
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