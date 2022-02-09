const express = require('express');
const db = require('../../db');
const bids = require("./bid_controller");

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

router.post('/create_bid', bids.create);
router.post('/', bids.findAll);
router.post('/findNFT', bids.findOne);
router.post('/updateBidStatus', bids.update);
router.post('/deleteBid',  bids.delete);

module.exports = router;