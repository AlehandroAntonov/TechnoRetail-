-- AlterTable
ALTER TABLE `Customer_order` ADD COLUMN `discount` INTEGER NULL DEFAULT 0,
    ADD COLUMN `promoCode` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PromoCode` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `discountType` VARCHAR(191) NOT NULL DEFAULT 'percentage',
    `discountValue` INTEGER NOT NULL DEFAULT 0,
    `validUntil` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `minOrderAmount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PromoCode_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
