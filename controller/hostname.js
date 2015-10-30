"use strict";
var util = require("util");
var fs = require("fs");
var goose = require("../models/mongoose").instance;
var hostnameSchema = require("../models/schema-hostname.js");
var Member = goose.model("Member", hostnameSchema);

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
		fs.readFile(getFilename(NAME, ADDRESS), respondWithFile);
	}

	function respondWithMembers (err, docs) {
		if (err) {
			return res.send(err);
		}

		res.status(200).send(docs);
	}

	function respondWithFile (readfileResponse) {
		console.log("read respond: ", readfileResponse);

		var fileNotFound = readfileResponse && readfileResponse.code === "ENOENT";
		if (fileNotFound) {
			return res.status(404).send({
				errno: readfileResponse.errno,
				code: readfileResponse.code
			});
		}

		res.status(200).send(readfileResponse);

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


	var findMemberCriteria = {
		name: NAME,
		address: IP
	};

	var updateMemberFields = {
		name: NAME,
		address: IP,
		message: MESSAGE
	};

	for (var key in findMemberCriteria) {
		if (findMemberCriteria[key] === null || findMemberCriteria[key] === undefined) {
			delete findMemberCriteria[key];
		}
	}

	req.on("data", save);

	
	Member.findOneAndUpdate(findMemberCriteria, 
				updateMemberFields,
				{ new: true, upsert: true }, 
				respond);

	function save (chunk) {
		console.log("chunkit", chunk);
		rawData = chunk;
	}

	function respond (err, newDoc) {
		newDoc = newDoc || {};

		if (!!rawData) {
			MESSAGE = rawData + "\r";
		}

		var stream = fs.createWriteStream(getFilename(NAME, IP));
		stream.write(MESSAGE);
		stream.end();

		if (err) {
			return res.send(err);
		}

		return res.status(200).send(newDoc);

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

	var filename = __dirname.concat("/../").concat("public/hostname/").concat([entryName, entryAddress].join("_")).concat(".html");
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

