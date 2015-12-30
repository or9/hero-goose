var Schema = require("mongoose").Schema;

var hostname = new Schema({

    name:       { type: Schema.Types.String, default: "anonymous" },
    address:    { type: String },
    //message:    { type: Schema.Types.String }
    message:	{ type: Schema.Types.Mixed },
    isUpdated:	{ type: Schema.Types.Boolean, default: true }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

hostname.index({ name: 1, address: 1 }, { unique: true });

//hostname.pre("save", saveIfModified);

module.exports = hostname;

function saveIfModified (next) {
	// isModified doesn't work. timestamps considered mod?
	//console.log("isModfied?", this.isUpdated());
	if (!this.isModified()) {
		return;
	}

	next();
}
