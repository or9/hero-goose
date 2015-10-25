/* jshint globalstrict: true */
"use strict";
var mongoose = require("mongoose");

module.exports = {
	get instance () {
		return mongoose;
	},
	update: update,
	find: find,
	findOrCreate: findOrCreate,
	findById: findById,
	findByIdAndUpdate: findByIdAndUpdate,
	remove: remove,
	removeAll: removeAll,
	save: save,
	create: create
};

var util = require("util");
var url_mongo = process.env.MONGOLAB_URI || "mongodb://localhost:17017";
util.log("instantiating goose at " + url_mongo);

mongoose.connect(url_mongo);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "DB connection error: "));

db.once("open", function callback() {
	console.log("Goose Started");
});

// Helper functions

function errHandler(err) {
	// maybe try - catch some stuff. Or not
	throw err;
}

function errCallback(err) {
	if(err) return errHandler(err);
}

function findOrCreate(model, properties, callback) {
	model.find(properties, next);

	function next (err) {
		if (err) {
			return create(model, properties, callback);
		}
	}
}

function save(model) {
		model.save(errCallback);
}

function create(model, properties, callback) {
	model.create(properties, callback);
}

function update(model, updateByObject) {
	var id = updateByObject.id;
	delete updateByObject.id;
	model.update({ _id: id }, { $set: updateByObject }, errCallback);
}

function findByIdAndUpdate(model, id, updateByObject) {
	model.update(id, { $set: updateByObject }, function(err, instance) {
		if(err) return errHandler(err);
		return instance;
	});
}

function find(model, byProperty, callback) {
	model.find(byProperty, callback);
}

function findById(model, id) {
	model.findById(id, function(err, instance) {
		if(err) return errHandler(err);
		instance.save(errHandler);
		return instance; // does it really need to return?
	});
}

function removeAll(model) {
	model.find({ _id: /\d/i }).exec();
}

function remove(model, byProperty) {
	model.remove(byProperty, errHandler);
}

function updateTimestamp(model, id) {
	model.findById(id, function(err, instance) {
	});
}

