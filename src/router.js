const { trackVisitor, vistorMessage } = require("./visitor");

const router = require("express").Router();

router.post("/track-visitor", trackVisitor);
router.post("/visitor-message", vistorMessage);

module.exports = router;
