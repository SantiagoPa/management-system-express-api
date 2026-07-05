-- DropForeignKey
ALTER TABLE "alertas" DROP CONSTRAINT "alertas_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "historial_productos" DROP CONSTRAINT "historial_productos_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "ordenes_compra" DROP CONSTRAINT "ordenes_compra_producto_id_fkey";

-- AddForeignKey
ALTER TABLE "historial_productos" ADD CONSTRAINT "historial_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
