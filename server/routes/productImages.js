const express = require('express')
const router = express.Router()
const {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage
} = require('../controllers/productImages')


/**
 * @openapi
 * /api/images/{id}:
 *   get:
 *     tags: [Product Images]
 *     summary: Get additional images for a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Product id.
 *     responses:
 *       200:
 *         description: The product's images
 *   put:
 *     tags: [Product Images]
 *     summary: Update product images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated }
 *   delete:
 *     tags: [Product Images]
 *     summary: Delete product images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 */
router.route('/:id').get(getSingleProductImages);

/**
 * @openapi
 * /api/images:
 *   post:
 *     tags: [Product Images]
 *     summary: Add a product image
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productID: { type: string }
 *               image: { type: string }
 *     responses:
 *       201: { description: Image added }
 */
router.route('/').post(createImage);


router.route('/:id').put(updateImage);


router.route('/:id').delete(deleteImage);

module.exports = router
