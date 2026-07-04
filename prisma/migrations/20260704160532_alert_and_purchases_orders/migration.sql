-- CreateEnum
CREATE TYPE "TypeAlert" AS ENUM ('STOCK_BAJO');

-- CreateEnum
CREATE TYPE "StatusAlert" AS ENUM ('ACTIVA', 'RESUELTA');

-- CreateEnum
CREATE TYPE "StatusPurchaseOrder" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA');

-- CreateTable
CREATE TABLE "Alerts" (
    "id" TEXT NOT NULL,
    "tipo" "TypeAlert" NOT NULL,
    "estado" "StatusAlert" NOT NULL,
    "descripcion" VARCHAR NOT NULL,

    CONSTRAINT "Alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "estado" "StatusPurchaseOrder" NOT NULL DEFAULT 'PENDIENTE',
    "proveedor" VARCHAR NOT NULL,
    "cantidad_solicitada" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
