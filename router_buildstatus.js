"use strict";

var router = require("express").Router();
var buildstatus = require("./controller/buildstatus");

router.get("/:PROJECT", buildstatus.get);
//router.post("/:PROJECT/:STATUS?", buildstatus.set);
router.post("/", buildstatus.set);

module.exports = router;
