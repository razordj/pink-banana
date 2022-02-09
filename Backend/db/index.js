const dbConfig = require("./db.config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.User = require("./users.model")(mongoose);
db.Upload = require("./uploads.model")(mongoose);
db.Bid = require("./bidData.model")(mongoose);
db.Collection = require('./collection.model')(mongoose);

module.exports = db;
