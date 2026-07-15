const express = require("express");

const router = express.Router();

const { getProductBySlug } = require("../controllers/slugs");

/**
 * @openapi
 * /api/slugs/{slug}:
 *   get:
 *     tags: [Slugs]
 *     summary: Get a product by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string, example: smart-phone-demo }
 *     responses:
 *       200:
 *         description: The product
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       404: { description: Product not found }
 */
router.route("/:slug").get(getProductBySlug);

module.exports = router;