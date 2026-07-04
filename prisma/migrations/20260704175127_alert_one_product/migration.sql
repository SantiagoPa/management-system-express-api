/*
  Warnings:

  - A unique constraint covering the columns `[producto_id]` on the table `alertas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "alertas_producto_id_key" ON "alertas"("producto_id");
