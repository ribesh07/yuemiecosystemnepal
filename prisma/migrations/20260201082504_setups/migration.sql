-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `is_phone_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_email_verified` BOOLEAN NOT NULL DEFAULT false,
    `emailVerifiedAt` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `orderCount` INTEGER NOT NULL DEFAULT 0,
    `loginMedium` VARCHAR(191) NULL,
    `socialId` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `rememberToken` VARCHAR(191) NULL,
    `profilePhotoPath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_userId_key`(`userId`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `accountType` VARCHAR(191) NULL,
    `roleId` BIGINT NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profilePhotoPath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `modules` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provinces` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `province_name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `set_shipping` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `provinceId` BIGINT NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `shippingCost` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `applyShipping` BOOLEAN NOT NULL DEFAULT true,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address_zone` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cityId` BIGINT NOT NULL,
    `zone_name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_address_book` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customer_id` BIGINT NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `province_id` BIGINT NOT NULL,
    `city_id` BIGINT NOT NULL,
    `zone_id` BIGINT NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `landmark` VARCHAR(191) NULL,
    `addressType` ENUM('HOME', 'OFFICE', 'OTHERS') NULL DEFAULT 'HOME',
    `defaultShipping` BOOLEAN NOT NULL DEFAULT false,
    `defaultBilling` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brand_name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `top` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `brands_brand_name_key`(`brand_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `parentId` BIGINT NULL,
    `image` VARCHAR(191) NULL,
    `top` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `categories_category_name_key`(`category_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_code` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `product_description` VARCHAR(191) NULL,
    `key_specifications` VARCHAR(191) NULL,
    `packaging` VARCHAR(191) NULL,
    `warranty` VARCHAR(191) NULL,
    `categoryId` BIGINT NULL,
    `categoryName` VARCHAR(191) NULL,
    `brandId` INTEGER NULL,
    `brandName` VARCHAR(191) NULL,
    `deliveryTargetDays` INTEGER NULL DEFAULT 7,
    `actual_price` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `sell_price` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `discount` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `stockQuantity` BIGINT NOT NULL DEFAULT 0,
    `availableQuantity` BIGINT NOT NULL DEFAULT 0,
    `weeklyProduct` BOOLEAN NOT NULL DEFAULT false,
    `flashSaleProduct` BOOLEAN NOT NULL DEFAULT false,
    `specialProduct` BOOLEAN NOT NULL DEFAULT false,
    `todayDeals` BOOLEAN NOT NULL DEFAULT false,
    `status` INTEGER NOT NULL DEFAULT 1,
    `mainImage` VARCHAR(191) NULL,
    `productCatalog` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `products_product_code_key`(`product_code`),
    UNIQUE INDEX `products_slug_key`(`slug`),
    INDEX `products_categoryId_idx`(`categoryId`),
    INDEX `products_brandId_idx`(`brandId`),
    INDEX `products_sell_price_idx`(`sell_price`),
    INDEX `products_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_images` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `mainImage` VARCHAR(191) NULL,
    `productCode` VARCHAR(191) NOT NULL,
    `imagePath` JSON NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `product_images_productCode_key`(`productCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `productCode` VARCHAR(191) NOT NULL,
    `attributes` JSON NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `stock` INTEGER NOT NULL,
    `sku` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customerId` BIGINT NULL,
    `subtotal` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `tax` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `shippingCost` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `cart_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cartId` BIGINT NOT NULL,
    `productCode` VARCHAR(191) NOT NULL,
    `quantity` BIGINT NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `actualPrice` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customerId` BIGINT NOT NULL,
    `productCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `customerId` BIGINT NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `subtotal` DECIMAL(65, 30) NOT NULL,
    `tax` DECIMAL(65, 30) NOT NULL,
    `shippingCost` DECIMAL(65, 30) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL,
    `totalAmount` DECIMAL(65, 30) NOT NULL,
    `orderStatus` VARCHAR(191) NOT NULL DEFAULT 'processing',
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'unpaid',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `orderId` BIGINT NOT NULL,
    `productCode` VARCHAR(191) NOT NULL,
    `quantity` BIGINT NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `subtotal` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_payments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `orderId` BIGINT NOT NULL,
    `paymentMode` VARCHAR(191) NULL,
    `transactionId` VARCHAR(191) NULL,
    `paidAmount` DECIMAL(65, 30) NOT NULL,
    `dueAmount` DECIMAL(65, 30) NOT NULL,
    `status` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_reviews` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customerId` BIGINT NULL,
    `productCode` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `review_detail` VARCHAR(191) NOT NULL,
    `rating` DECIMAL(65, 30) NOT NULL,
    `imagePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `subtitle` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startAt` DATETIME(3) NULL,
    `endAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PopupAds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `colorCode` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startAt` DATETIME(3) NULL,
    `endAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `admin_roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `set_shipping` ADD CONSTRAINT `set_shipping_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address_zone` ADD CONSTRAINT `address_zone_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `set_shipping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_address_book` ADD CONSTRAINT `customer_address_book_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_address_book` ADD CONSTRAINT `customer_address_book_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_address_book` ADD CONSTRAINT `customer_address_book_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `set_shipping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_address_book` ADD CONSTRAINT `customer_address_book_zone_id_fkey` FOREIGN KEY (`zone_id`) REFERENCES `address_zone`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_productCode_fkey` FOREIGN KEY (`productCode`) REFERENCES `products`(`product_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variations` ADD CONSTRAINT `product_variations_productCode_fkey` FOREIGN KEY (`productCode`) REFERENCES `products`(`product_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_productCode_fkey` FOREIGN KEY (`productCode`) REFERENCES `products`(`product_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_productCode_fkey` FOREIGN KEY (`productCode`) REFERENCES `products`(`product_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productCode_fkey` FOREIGN KEY (`productCode`) REFERENCES `products`(`product_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_payments` ADD CONSTRAINT `order_payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_reviews` ADD CONSTRAINT `product_reviews_productCode_fkey` FOREIGN KEY (`productCode`) REFERENCES `products`(`product_code`) ON DELETE RESTRICT ON UPDATE CASCADE;
