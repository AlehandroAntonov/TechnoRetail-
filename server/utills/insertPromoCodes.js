// Seed script for demo promo codes (SCRUM-5).
// Run from server/utills:  node insertPromoCodes.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const demoPromoCodes = [
  {
    // Valid: 10% off, no minimum, active, expires in the future
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    validUntil: new Date("2099-12-31T23:59:59Z"),
    isActive: true,
    minOrderAmount: 0,
  },
  {
    // Expired: was 20% off but validUntil is in the past
    code: "EXPIRED20",
    discountType: "percentage",
    discountValue: 20,
    validUntil: new Date("2020-01-01T00:00:00Z"),
    isActive: true,
    minOrderAmount: 0,
  },
  {
    // Valid but requires a minimum order amount of $100
    code: "BIG15",
    discountType: "percentage",
    discountValue: 15,
    validUntil: new Date("2099-12-31T23:59:59Z"),
    isActive: true,
    minOrderAmount: 100,
  },
];

async function insertPromoCodes() {
  try {
    for (const promo of demoPromoCodes) {
      await prisma.promoCode.upsert({
        where: { code: promo.code },
        update: promo,
        create: promo,
      });
    }
    console.log("Demo promo codes inserted successfully!");
    console.log(
      demoPromoCodes
        .map((p) => `  ${p.code} (${p.discountValue}% , min $${p.minOrderAmount})`)
        .join("\n")
    );
  } catch (error) {
    console.error("Error inserting promo codes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertPromoCodes();
