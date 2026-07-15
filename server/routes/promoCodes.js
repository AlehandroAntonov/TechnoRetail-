const express = require("express");

const router = express.Router();

const { applyPromoCode } = require("../controllers/promoCodes");

/**
 * @openapi
 * /api/promo/apply:
 *   post:
 *     tags: [Promo Codes]
 *     summary: Validate and apply a promo code
 *     description: >
 *       Validates a promo code against the given order subtotal and returns the
 *       computed discount and new total. Returns a clear error for unknown,
 *       inactive, expired or below-minimum codes. The discount is capped so the
 *       total can never reach zero or go negative.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, orderTotal]
 *             properties:
 *               code: { type: string, example: SAVE10 }
 *               orderTotal: { type: number, example: 200 }
 *     responses:
 *       200:
 *         description: Promo code applied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid: { type: boolean, example: true }
 *                 code: { type: string, example: SAVE10 }
 *                 discountType: { type: string, example: percentage }
 *                 discountValue: { type: integer, example: 10 }
 *                 discount: { type: integer, example: 20 }
 *                 newTotal: { type: integer, example: 180 }
 *       400:
 *         description: Invalid / inactive / expired / below-minimum code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid: { type: boolean, example: false }
 *                 error: { type: string, example: This promo code has expired }
 *       404:
 *         description: Promo code not found
 */
router.route("/apply").post(applyPromoCode);

module.exports = router;
