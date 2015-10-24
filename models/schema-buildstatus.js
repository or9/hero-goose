var Schema = require("mongoose").Schema;
console.log("exporting buildstatus schema");

module.exports = new Schema({
	name:		{ type: String, unique: true, index: true },
	status:		Schema.Types.Mixed,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});
