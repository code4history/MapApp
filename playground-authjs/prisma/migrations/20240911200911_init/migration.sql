-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `service` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `accountName` VARCHAR(191) NULL,
    `sub` VARCHAR(191) NOT NULL,
    `iat` INTEGER NOT NULL,
    `exp` INTEGER NOT NULL,
    `jti` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_sub_key`(`sub`),
    UNIQUE INDEX `User_jti_key`(`jti`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
