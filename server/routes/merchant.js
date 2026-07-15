const express = require("express");
const router = express.Router();
const {
  getAllMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant,
} = require("../controllers/merchant");

/**
 * @openapi
 * /api/merchants:
 *   get:
 *     tags: [Merchants]
 *     summary: List merchants
 *     responses:
 *       200:
 *         description: A list of merchants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Merchant' }
 *   post:
 *     tags: [Merchants]
 *     summary: Create a merchant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Merchant' }
 *     responses:
 *       201: { description: Merchant created, content: { application/json: { schema: { $ref: '#/components/schemas/Merchant' } } } }
 */
router.get("/", getAllMerchants);
router.post("/", createMerchant);

/**
 * @openapi
 * /api/merchants/{id}:
 *   get:
 *     tags: [Merchants]
 *     summary: Get a merchant by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The merchant, content: { application/json: { schema: { $ref: '#/components/schemas/Merchant' } } } }
 *       404: { description: Merchant not found }
 *   put:
 *     tags: [Merchants]
 *     summary: Update a merchant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Merchant' }
 *     responses:
 *       200: { description: Merchant updated }
 *       404: { description: Merchant not found }
 *   delete:
 *     tags: [Merchants]
 *     summary: Delete a merchant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Merchant deleted }
 *       404: { description: Merchant not found }
 */
router.get("/:id", getMerchantById);
router.put("/:id", updateMerchant);
router.delete("/:id", deleteMerchant);

module.exports = router;