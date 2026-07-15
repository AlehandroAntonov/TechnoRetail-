const express = require("express");

const router = express.Router();

const {
  getAllWishlistByUserId,
  getAllWishlist,
  createWishItem,
  deleteWishItem,
  getSingleProductFromWishlist
} = require("../controllers/wishlist");

/**
 * @openapi
 * /api/wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: List all wishlist items
 *     description: NOTE — the /api/wishlist route is currently commented out in app.js, so this endpoint is not mounted.
 *     responses:
 *       200: { description: A list of wishlist items }
 *   post:
 *     tags: [Wishlist]
 *     summary: Add a product to a user's wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               productId: { type: string }
 *     responses:
 *       201: { description: Item added }
 */
router.route("/").get(getAllWishlist).post(createWishItem);

/**
 * @openapi
 * /api/wishlist/{userId}:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get a user's wishlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The user's wishlist }
 */
router.route("/:userId").get(getAllWishlistByUserId);

/**
 * @openapi
 * /api/wishlist/{userId}/{productId}:
 *   get:
 *     tags: [Wishlist]
 *     summary: Check if a product is in a user's wishlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The wishlist entry }
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove a product from a user's wishlist
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Removed }
 */
router.route("/:userId/:productId").get(getSingleProductFromWishlist).delete(deleteWishItem);

module.exports = router;
