/*
  Warnings:

  - A unique constraint covering the columns `[brand_name]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `brands_brand_name_key` ON `brands`(`brand_name`);

-- CreateIndex
CREATE UNIQUE INDEX `categories_category_name_key` ON `categories`(`category_name`);
