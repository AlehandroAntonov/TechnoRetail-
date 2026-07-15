const prisma = require("../utills/db");

// Validate & apply a promo code against a given order subtotal.
// POST /api/promo/apply   body: { code: string, orderTotal: number }
// Responds with the computed discount and the new total, or a clear error.
async function applyPromoCode(request, response) {
  try {
    const { code, orderTotal } = request.body || {};

    if (!code || typeof code !== "string") {
      return response.status(400).json({
        valid: false,
        error: "Promo code is required",
      });
    }

    const subtotal = Number(orderTotal);
    if (isNaN(subtotal) || subtotal <= 0) {
      return response.status(400).json({
        valid: false,
        error: "Invalid order total",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const promo = await prisma.promoCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!promo) {
      return response.status(404).json({
        valid: false,
        error: "Promo code not found",
      });
    }

    if (!promo.isActive) {
      return response.status(400).json({
        valid: false,
        error: "This promo code is no longer active",
      });
    }

    // Expiry check
    if (promo.validUntil && new Date(promo.validUntil) < new Date()) {
      return response.status(400).json({
        valid: false,
        error: "This promo code has expired",
      });
    }

    // Minimum order amount check
    if (subtotal > promo.minOrderAmount) {
      // order is large enough, continue
    } else if (promo.minOrderAmount > 0) {
      return response.status(400).json({
        valid: false,
        error: `This promo code requires a minimum order of $${promo.minOrderAmount}`,
      });
    }

    // Compute discount
    let discount = 0;
    if (promo.discountType === "percentage") {
      discount = Math.round((subtotal * promo.discountValue) / 100);
    } else {
      // fixed
      discount = promo.discountValue;
    }

    // Never let the discount push the total to zero or below.
    if (discount >= subtotal) {
      discount = subtotal - 1;
    }
    if (discount < 0) discount = 0;

    const newTotal = subtotal - discount;

    return response.status(200).json({
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discount: discount,
      newTotal: newTotal,
    });
  } catch (error) {
    console.error("Error applying promo code:", error);
    return response.status(500).json({
      valid: false,
      error: "Failed to apply promo code. Please try again.",
    });
  }
}

module.exports = { applyPromoCode };
