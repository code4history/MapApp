-- DropIndex
DROP INDEX `idx_position` ON `Poi`;
CREATE SPATIAL INDEX `idx_position` ON `Poi`(`geom`);