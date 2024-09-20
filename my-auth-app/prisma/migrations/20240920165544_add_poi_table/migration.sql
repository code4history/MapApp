-- CreateTable
CREATE TABLE `Poi` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `geom` GEOMETRY NOT NULL SRID 4326,

    PRIMARY KEY (`id`),
    SPATIAL INDEX `idx_position` (`geom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
