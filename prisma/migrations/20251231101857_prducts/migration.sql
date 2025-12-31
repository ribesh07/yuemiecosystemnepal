/*
  Warnings:

  - A unique constraint covering the columns `[productCode]` on the table `product_images` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `flashSaleProduct` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `productCatalog` VARCHAR(191) NULL,
    ADD COLUMN `specialProduct` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `todayDeals` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `weeklyProduct` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `product_images_productCode_key` ON `product_images`(`productCode`);

-- CreateIndex
CREATE UNIQUE INDEX `users_userId_key` ON `users`(`userId`);
