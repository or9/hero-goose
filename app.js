"use strict";
process.title = "roadside-romeo";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = {
	buildStatus: require("./router_buildstatus"),
    	hostname: require("./router_hostname")
};
var util = require("util");
var multer = require("multer");

var app = express();

app.use(allowCors);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer());

require("express").Router().all("/", homeRender);
app.use('/buildstatus', router.buildStatus);
app.use("/hostname", router.hostname);

// catch 404 and forward to error handler
app.use("*", catch404);

// error handlers
if (app.get('env') === 'development') {
	// development error handler
	// will print stacktrace
	app.use(devErrHandler);

} else {

	// production error handler
	// no stacktraces leaked to user
	//app.use(prodErrHandler);
	app.use(devErrHandler);
}

module.exports = app;


function homeRender (req, res) {
	res.render("Welcome to here!").end();
}

function catch404 (req, res, next) {
	console.log("caught 404. forward to err middleware");
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
}

function devErrHandler (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
}

function prodErrHandler (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}

function allowCors (req, res, next) {
	console.log("allow cors");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, ontent-Length, X-Requested-With");

	if ("OPTIONS" === req.method) {
		res.send(200);
	}

	next();
}

