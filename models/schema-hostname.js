var Schema = require("mongoose").Schema;

module.exports = new Schema({

    name:       { type: Schema.Types.String },
    address:    { type: String, index: true, unique: true },
    message:    { type: Schema.Types.String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});
