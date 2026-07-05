/*
  Warnings:

  - A unique constraint covering the columns `[codigo_sku]` on the table `productos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_sku_key" ON "productos"("codigo_sku");
