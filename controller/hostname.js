"use strict";
var util = require("util");
var goose = require("../models/mongoose").instance;
var hostnameSchema = require("../models/schema-hostname.js");
var Member = goose.model("Member", hostnameSchema);

module.exports = {
	create: create,
	read: read,
	update: update,
	delete: deleteFn
};

/**
 * @description Create a new entry in the database
 * @param {object} request
 * @param {object} request.body
 * @param {string} request.body.name
 * @param {string} request.body.message
 * @param {string} request.body.address
 * @param {object} request.params
 * @param {string} request.params.NAME
 * @param {string} request.params.ADDRESS
 * @param {string} request.params.MESSAGE
 * @return {response} response
 */
function create (req, res) {

	var NAME = getName(req);
	var ADDRESS = getAddress(req);
	var MESSAGE = req.body.message || req.params.MESSAGE || "";
	console.log("name? ", NAME);
	console.log("address? ", ADDRESS);
	// console.log("gimme everything you got", req.connection);
	// console.log("port? ", req.connection.port);

	Member.create({
		name: NAME,
		address: ADDRESS,
		message: MESSAGE
	}, respond);

	// Member.findOneAndUpdate(
	// 	{ name: name, address: address, message: message }, 
		
	// 	{ new: true, upsert: true }, 

	// 	respond);


	function respond (err, doc) {
		if (err) {
			return res.status(409).json({ err: err });
		}

		console.log("new entry: ", doc);

		res.status(200).send(doc);
	}

}

/**
 * @description get an entry from the database
 * @param {object} request
 * @param {string} request.param
 * @param {object} response
 * @return {response} response
 */
function read (req, res) {

	var name = getName(req);
	var data;

	console.log("reading");


	if (name) {
		console.log("find single", name);
		Member.findOne({ name: name }, respond);
	} else {
		// seems dangerous
		console.log("get all");
		Member.find({}, respond);
	}

	function respond (err, docs) {
		console.log("responding with docs", err, docs);
		if (err) {
			return res.send(err);
		}

		if (!docs || !docs.length) {
			return res.status(404).send("Not found");
		}
		
		res.status(200).send(docs);
	}

}

/**
 * @description Update an entry's IP address or name
 * @param {object} request
 * @param {string} request.param
 * @param {object} response
 * @return {response} response
 */
function update (req, res) {
	// IP will have ":"
	var IP = req.params.ADDRESS;
	var NAME = req.params.USERNAME;
	var MESSAGE = req.body.message || req.params.MESSAGE;
	
	Member.findOneAndUpdate(
		{ name: NAME, address: IP, message: MESSAGE, updated_at: Date.now() }, 
		
		{ new: true }, 

		respond);

	function respond (err, newDoc) {
		if (err) {
			return res.send(err);
		}

		if (!newDoc.length) {
			return res.status(404).send("Not found");
		}

		res.status(200).send(newDoc);
	}

}

/**
 * @description delete a row
 * @param {object} request
 * @param {string} request.param
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

function getName (req) {
	return req.params.NAME || req.body.name || "anonymous";
}

function getAddress (req) {
	return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
}

function updateIpAddress (req, res) {
	return res.status(200).send();
}

function updateName (req, res) {
	return res.status(200).send();
}
