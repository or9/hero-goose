"use strict";

var router = require("express").Router();
var ctrl = require("./controller/hostname");

router.get("/:NAME?", ctrl.read);
router.post("/:NAME?/:ADDRESS?/:MESSAGE?", ctrl.create);
router.put("/:NAME?/:ADDRESS?/:MESSAGE?", ctrl.update);
router.delete("/:NAME?", ctrl.delete);

module.exports = router;
