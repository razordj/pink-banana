const db = require("../../db");
const multer = require('multer');

const Users = db.User;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).single('userImg');

exports.create = (req, res) => {


  const url = req.protocol + '://' + req.get('host');
  const user = new Users({
    address: req.body.address,
    username: req.body.username,
    customURL: req.body.customURL,
    profilePhoto: req.body.profilePhoto,
    userBio: req.body.userBio,
    websiteURL: req.body.websiteURL,
    userImg: url + '/' + req.file.filename,
  });

  user
    .save(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.findAll = (req, res) => {
  const address = req.query.address;
  var condition = { address: { $regex: new RegExp(address), $options: "i" } };

  Users.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retrieving tutorials.",
      });
    });
};

exports.findOne = (req, res) => {
  const address = req.body.address;

  Users.findOne({ address: address })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Not found User with address " + adderss });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      // res.status(500)
      // .send({message: "Error retrieving User with address = " + address});
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }


  const id = req.body.id;
  const username = req.body.username;
  const customURL = req.body.customURL;
  const profilePhoto = req.body.profilePhoto;
  const userBio = req.body.userBio;
  const websiteURL = req.body.websiteURL;
  const url = req.protocol + '://' + req.get('host');


  Users.findByIdAndUpdate(
    id,
    {
      username: username,
      customURL: customURL,
      profilePhoto: profilePhoto,
      userBio: userBio,
      websiteURL: websiteURL,
      userImg: url + '/' + req.file.filename,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id = ${id}. Maybe User was not found.`,
        });
      } else res.send({ message: "User was updated successfully" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id = " + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Users.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id = ${id}. Maybe User was not found.`,
        });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id = " + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Users.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Users were deleted succesfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};
