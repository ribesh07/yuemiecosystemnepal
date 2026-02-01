/*
  Warnings:

  - You are about to drop the column `subtitle` on the `popupads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `popupads` DROP COLUMN `subtitle`,
    ADD COLUMN `colorCode` VARCHAR(191) NULL,
    MODIFY `imageUrl` VARCHAR(191) NULL;
