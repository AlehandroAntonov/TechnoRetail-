const express = require("express");

const router = express.Router();
const { searchProducts } = require("../controllers/search");

/**
 * @openapi
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Search products
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *         description: Search term matched against product title.
 *     responses:
 *       200:
 *         description: Matching products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Product' }
 */
router.route("/").get(searchProducts);

module.exports = router;
