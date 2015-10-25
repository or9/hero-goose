var Schema = require("mongoose").Schema;

var hostname = new Schema({

    name:       { type: Schema.Types.String },
    address:    { type: String, index: true },
    message:    { type: Schema.Types.String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

hostname.index({ name: 1, address: 1 }, { unique: true });

module.exports = hostname;
