"use strict";
var util = require("util");
var fs = require("fs");
var goose = require("../models/mongoose").instance;
var hostnameSchema = require("../models/schema-hostname.js");
var Member = goose.model("Member", hostnameSchema);
var jsdiff = require("diff");
require("colors");

module.exports = {
	create: update,
	read: read,
	update: update,
	delete: deleteFn
};

/**
 * @description get an entry from the database
 * @param {object} request
 * @param {object} request.params
 * @param {string} request.params.NAME
 * @param {string} request.params.ADDRESS
 * @return {response} response
 */
function read (req, res) {

	var NAME = req.params.NAME;
	var ADDRESS = getAddress(req);

	if (!req.params.NAME && !req.params.ADDRESS) {
		Member.find({}, respondWithMembers);
	} else {
		Member.findOne({ name: NAME },
			    respondWithDoc);
		//fs.readFile(getFilename(NAME, ADDRESS), respondWithFile);
	}

	function respondWithMembers (err, docs) {
		if (err) return res.send(err);

		console.log("read >> respondWithMembers >> is updated? ", docs.isUpdated);

		res.status(200).send(docs);
	}

	function respondWithDoc (err, doc) {
		var responseData;

		if (err) return res.send(err);

		if (!doc) return res.status(404).send();

		console.log("read >> respond with doc isUpdated? >>", doc.isUpdated);
		doc.message = doc.message || "no content";

		if (!doc.isUpdated) {
			console.log("read >> not modified >> 304");
			return res.status(304).end();
			//return res.status(200).send(doc.message.toString());
		}

		responseData = doc.message.toString();

		res.status(200).send(responseData);

	}

}

/**
 * @description Update an entry's IP address or name
 * @param {object} request
 * @param {object} request.params
 * @param {string} request.params.NAME
 * @param {string} request.params.MESSAGE
 * @param {Document} request.body
 * @return {response} response
 */
function update (req, res) {
	var IP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	var NAME = req.params.NAME
	var MESSAGE = req.params.MESSAGE;
	var rawData;

	var stream = fs.createWriteStream(getFilename(NAME, IP));

	var findMemberCriteria = {
		name: NAME,
		address: IP
	};

	var updateMemberFields = {
		name: NAME,
		address: IP
	};

	for (var key in findMemberCriteria) {
		if (findMemberCriteria[key] === null || findMemberCriteria[key] === undefined) {
			delete findMemberCriteria[key];
		}
	}

	req.on("data", save);

	function save (chunk) {

		rawData = chunk;

		//stream.write(chunk);

		var updateMemberFields = {
			message: chunk
		};
		
		Member.findOne({name: NAME}, foundOne);

		function foundOne (err, doc) {
			var diff = [];
			if (err) return respond(err);

			if (!doc) {
				console.log("not doc. make new\n");
				doc = new Member();
				doc.name = NAME;
				doc.address = IP;
				doc.isUpdated = true;
				console.log("\twrite >> foundOne >> save new doc\n\n");
			}

			doc.message = doc.message || "";

			if (doc.message.toString() === chunk.toString()) {
				console.log("write >> foundOne >> save doc not modified");
				doc.isUpdated = false;
			} else {
				diff = jsdiff.diffLines(doc.message.toString(), chunk.toString());
				diff.forEach(compare);
				doc.isUpdated = true;
			}

			doc.message = chunk.toString();

			doc.save(saved);

			function compare (part) {
				var color = part.added ? "green" :
					part.removed ? "red" :
						"grey";
				if (!part.added && !part.removed) {
					delete part.value;
					return;
				}

				process.stderr.write(part.value[color]);
			}

		}

		function saved (err, doc) {
			if (err) return respond(err);

			console.log("\twrite >> saved >> respond with doc");

			respond(err, doc);
		}

	}



	function respond (err, newDoc) {
		newDoc = newDoc || {};

		if (err) return res.send(err);

		console.log("\t\t\tPUT >> respond >> no err");

		res.end();

	}

}


/**
 * @description delete a row
 * @param {object} request
 * @param {object} request.params
 * @param {string} request.params.NAME
 * @param {string} request.params.ADDRESS
 * @param {object} response
 * @return {response} response
 */
function deleteFn (req, res) {
	var NAME = getName(req);
	var ADDRESS = getAddress(req);

	Member.remove({ name: NAME, address: ADDRESS }, respond);

	function respond (err, docs) {
		if (err) {
			return res.end();
		}

		if (!docs) {
			return res.status(404).send("Not found");
		}

		res.status(200).send(docs.result);
	}

}

function getFilename (entryName, entryAddress) {
	console.log("entryAddress? ", entryAddress);

	entryAddress = entryAddress.replace(/:/g, "-");

	var filename = __dirname.concat("/../").concat("public/hostname/").concat(entryName).concat(".html");
	console.log("filename? ", filename);
	return filename;
}

function getName (req) {
	return req.params.NAME || req.body.name || "anonymous";
}

function getAddress (req) {
	return req.params.ADDRESS || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
}

function updateIpAddress (req, res) {
	return res.status(200).send();
}

function updateName (req, res) {
	return res.status(200).send();
}

