"use strict";

var router = require("express").Router();
var ctrl = require("./controller/hostname");

router.get("/:NAME?/:ADDRESS?", ctrl.read);
router.post("/:NAME?/:MESSAGE?", ctrl.create);
router.put("/:NAME?/:MESSAGE?", ctrl.update);
router.delete("/:NAME?", ctrl.delete);

module.exports = router;
