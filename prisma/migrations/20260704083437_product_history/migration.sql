-- CreateEnum
CREATE TYPE "TypeProductHistory" AS ENUM ('entrada', 'salida');

-- DropIndex
DROP INDEX "productos_codigo_sku_key";

-- CreateTable
CREATE TABLE "historial_productos" (
    "id" TEXT NOT NULL,
    "tipo" "TypeProductHistory" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "producto_id" INTEGER NOT NULL,

    CONSTRAINT "historial_productos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "historial_productos" ADD CONSTRAINT "historial_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
