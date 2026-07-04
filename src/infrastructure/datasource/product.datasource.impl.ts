import { seedProductsData } from "../../data/const/seed_products.ts";
import { prisma } from "../../data/postgres/index.ts";
import type { FilterProductDto } from "../../domain/dtos/products/filter-product.dto.ts";
import type { UpdateAmountProductDto } from "../../domain/dtos/products/update-amount-prodcut.dto.ts";
import { ProductEntity, type CreateProductDto, type ProductDatasource } from "../../domain/index.ts";
import type { Prisma } from "../../generated/prisma/client.ts";

export class ProductDatasourceImpl implements ProductDatasource {

    async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
        const product = await prisma.producto.create({
            data: createProductDto
        });
        return ProductEntity.fromObject(product);
    }

    async updateAmountById(updateAmountProductDto: UpdateAmountProductDto): Promise<ProductEntity> {
        const { id, operacion, motivo, cantidad } = updateAmountProductDto;
        const product = await this.findById(id);

        if (operacion === "entrada") {
            const newProduct = await prisma.producto.update({
                where: { id },
                data: {
                    stock_actual: product.stock_actual + cantidad
                }
            });
            await prisma.productHistory.create({
                data: {
                    producto_id: id,
                    tipo: operacion,
                    cantidad: cantidad,
                    motivo: `${operacion} - ${motivo}`
                }
            });
            return ProductEntity.fromObject(newProduct);
        } else {
            // salida
            const subtraction = product.stock_actual - cantidad;

            if (subtraction < 0) throw `La cantidad a de salida (${cantidad}) es mayor al stock actual (${product.stock_actual}) del producto ${product.nombre}`;

            const newProduct = await prisma.producto.update({
                where: { id },
                data: {
                    stock_actual: product.stock_actual - cantidad
                }
            });
            await prisma.productHistory.create({
                data: {
                    producto_id: id,
                    tipo: operacion,
                    cantidad: cantidad,
                    motivo: `${operacion} - ${motivo}`
                }
            })
            return ProductEntity.fromObject(newProduct);
        }
    }

    async getAll(filterProductDto: FilterProductDto): Promise<ProductEntity[]> {
        const { categoria, proveedor, estado_alerta, rango_stock } = filterProductDto;
        const where: Prisma.ProductoWhereInput = {
            ...(categoria !== undefined && { categoria }),
            ...(proveedor !== undefined && { proveedor }),
            ...(rango_stock !== undefined && {
                stock_actual: {
                    gte: rango_stock[0],
                    lte: rango_stock[1],
                },
            }),
            ...(estado_alerta !== undefined && {
                alertas: {
                    some: {
                        estado: estado_alerta,
                    },
                },
            }),
        };
        const products = await prisma.producto.findMany({ where: where });
        return products.map(product => ProductEntity.fromObject(product));
    }

    async findById(id: number): Promise<ProductEntity> {
        const product = await prisma.producto.findFirst({ where: { id } });
        if (!product) throw `Producto con el id: ${id} no fue encontrado`;
        return ProductEntity.fromObject(product);
    }

    async updateById(id: number): Promise<ProductEntity> {
        throw new Error("Method not implemented.");
    }

    async deleteById(id: number): Promise<ProductEntity> {
        await this.findById(id);
        const product = await prisma.producto.delete({ where: { id } });
        return ProductEntity.fromObject(product);
    }

    async seed(): Promise<string> {
        await prisma.producto.deleteMany();
        const products = await prisma.producto.createMany({
            data: seedProductsData
        });
        return `SEED DE PRODUCTOS EJECUTADO, CANTIDAD DE PRODUCTOS CREADOS: ${products.count}`
    }

}