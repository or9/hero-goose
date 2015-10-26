var Schema = require("mongoose").Schema;

var hostname = new Schema({

    name:       { type: Schema.Types.String, default: "anonymous" },
    address:    { type: String },
    //message:    { type: Schema.Types.String }
    message:	{ type: Schema.Types.Mixed }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

hostname.index({ name: 1, address: 1 }, { unique: true });

module.exports = hostname;
