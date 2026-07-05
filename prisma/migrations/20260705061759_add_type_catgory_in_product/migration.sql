/*
  Warnings:

  - Changed the type of `categoria` on the `productos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TypeCategory" AS ENUM ('Bebidas', 'Lacteos', 'Snacks', 'Limpieza', 'Frutas', 'Granos');

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "categoria",
ADD COLUMN     "categoria" "TypeCategory" NOT NULL;
