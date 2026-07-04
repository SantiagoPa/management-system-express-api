/*
  Warnings:

  - You are about to drop the `Alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_producto_id_fkey";

-- DropTable
DROP TABLE "Alerts";

-- DropTable
DROP TABLE "PurchaseOrder";

-- CreateTable
CREATE TABLE "alertas" (
    "id" TEXT NOT NULL,
    "tipo" "TypeAlert" NOT NULL,
    "estado" "StatusAlert" NOT NULL,
    "descripcion" VARCHAR NOT NULL,

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes_compra" (
    "id" TEXT NOT NULL,
    "estado" "StatusPurchaseOrder" NOT NULL DEFAULT 'PENDIENTE',
    "proveedor" VARCHAR NOT NULL,
    "cantidad_solicitada" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,

    CONSTRAINT "ordenes_compra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
