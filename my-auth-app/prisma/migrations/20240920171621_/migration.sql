-- DropIndex
DROP INDEX `idx_position` ON `Poi`;

-- CreateIndex
CREATE INDEX `Poi_geom_idx` ON `Poi`(`geom`);
