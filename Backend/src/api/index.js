const express = require('express');

const users = require('./users');
const upload = require('./upload');
const bids = require('./bids');
const collect = require("./collection");

const router = express.Router();

router.get('/', (req, res) => {
  console.log("testing now")
  res.json({
    message: 'This is backend right?'
  });
});

router.use('/users', users);
router.use('/upload', upload);
router.use('/bids', bids);
router.use('/collect', collect);

module.exports = router;