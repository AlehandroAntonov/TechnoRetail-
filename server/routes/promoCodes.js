const express = require("express");

const router = express.Router();

const { applyPromoCode } = require("../controllers/promoCodes");

router.route("/apply").post(applyPromoCode);

module.exports = router;
