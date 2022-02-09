const express = require('express');
const db = require('../../db');
const uploads = require('./upload_controller'); 

const router = express.Router();

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

router.get('/', uploads.findAll);
router.post('/upload_details', uploads.create);
router.put('/', uploads.update);
router.delete('/', uploads.delete);

module.exports = router;