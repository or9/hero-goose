"use strict";
var util = require("util");
var goose = require("../models/mongoose").instance;
var projectStatusSchema = require("../models/schema-buildstatus.js");
var BuildStatus = goose.model("buildstatus", projectStatusSchema);

module.exports = {
	set: setBuildStatus,
	get: getBuildStatus 
};

/**
 * Gets build status image for associated project
 *
 * @param {object} request
 * @param {object} request.param
 * @param {string} request.param.PROJECT - Project name for which to retrieve build status image
 *
 * @return {response} response
 */
function getBuildStatus (req, res) {
	var projectName = req.params.PROJECT;
	var query;

	// if parseInt is !NaN, findById, else find by name

	query = BuildStatus.find({ name: projectName });

	query.exec(function (err, docs) {
		var img_dir = "public/images/build/";
		var status = "";

		if (err) {
			console.log("err!", err);
			return res.status(404).json(err);
		}

		if (!docs.length) {
			console.log("not docs!", docs);
			return res.status(404).send("Project not found");
		}
		
		console.log("docs? ", docs);

		status = docs[0].status;

		if (status === true) {
			status = "passing";
		}

		if (status === false) {
			status = "failing";
		}

		if (status === undefined || status === null) {
			status = "unknown";
		}

		res.status(200).sendfile(img_dir + status + "-flat.svg");

	});

}

/**
 * Updates or creates a new project entry with status provided
 *
 * @param request
 * @param request.body {array|object}
 * @param request.body.project {string}
 * @param request.body.status {string}
 *
 * @return response
 */
function setBuildStatus (req, res) {
	// valid statuses are [true,"passing"|false,"failing"|"running"|null,undefined,"unknown"|"unstable"]

	var projectName = "";
	var newStatus = "";

	if (Array.isArray(req.body)) {

		projectName = req.body[0];
		newStatus = req.body[1];

	} else {

		projectName = req.body.project || req.body.projectName || req.body.name;
		newStatus = req.body.status || req.body.projectStatus || req.body.buildStatus;

	}

	var find = { name: projectName };
	var update = { 
		status: newStatus.toLowerCase(),
		updated_at: Date.now()
	};
	var options = { 
		new: true,
		upsert: true 
	};

	BuildStatus.findOneAndUpdate(find, update, options, respond);

	function respond (err, doc) {
		if (err && !err.status) {
			return res.status(400).send(err);
		}

		return res.status(204).end();
	}

}

function mapErr (errStr) {
	errStr = errStr;
	return errStr;
}

