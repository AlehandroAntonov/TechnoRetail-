const express = require("express");
const router = express.Router();
const { uploadMainImage } = require("../controllers/mainImages");

/**
 * @openapi
 * /api/main-image:
 *   post:
 *     tags: [Main Image]
 *     summary: Upload a product main image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               uploadedFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200: { description: Image uploaded }
 *       400: { description: No file uploaded }
 */
router.route("/").post(uploadMainImage);

module.exports = router;
