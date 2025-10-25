const { trackVisitor } = require("./visitor");

const router = require("express").Router();

router.post("/track-visitor", trackVisitor);

module.exports = router;
