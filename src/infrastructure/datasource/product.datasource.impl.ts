import { seedProductsData } from "../../data/const/seed_products.ts";
import { prisma } from "../../data/postgres/index.ts";
import { ProductExtendedEntity } from "../../domain/entities/product-extended.entity.ts";

import { ProductEntity, type CreateProductDto, type ProductDatasource } from "../../domain/index.ts";
import type { FilterProductDto } from "../../domain/dtos/products/filter-product.dto.ts";
import type { UpdateAmountProductDto } from "../../domain/dtos/products/update-amount-prodcut.dto.ts";
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

            const addition = product.stock_actual + cantidad;

            const promiseUpdate = prisma.producto.update({
                where: { id },
                data: {
                    stock_actual: addition
                }
            });

            const promiseHistory = prisma.productHistory.create({
                data: {
                    producto_id: id,
                    tipo: operacion,
                    cantidad: cantidad,
                    motivo: `${operacion} - ${motivo}`
                }
            });

            const [newProduct] = await Promise.all([promiseUpdate, promiseHistory]);

            if (addition > product.stock_minimo) {
                await prisma.alerts.update({
                    where: { producto_id: product.id },
                    data: {
                        estado: "RESUELTA",
                        descripcion: `Alerta resuleta!`,
                    }
                })
            }

            return ProductEntity.fromObject(newProduct);

        } else {
            // salida
            const subtraction = product.stock_actual - cantidad;

            if (subtraction < 0) throw `La cantidad a de salida (${cantidad}) es mayor al stock actual (${product.stock_actual}) del producto ${product.nombre}`;


            const promiseUpdate = prisma.producto.update({
                where: { id },
                data: {
                    stock_actual: subtraction
                }
            });

            const promiseHistory = prisma.productHistory.create({
                data: {
                    producto_id: id,
                    tipo: operacion,
                    cantidad: cantidad,
                    motivo: `${operacion} - ${motivo}`
                }
            });

            const [newProduct] = await Promise.all([promiseUpdate, promiseHistory]);

            if (subtraction <= product.stock_minimo) {
                await prisma.alerts.upsert({
                    where: { producto_id: id },
                    create: {
                        tipo: "STOCK_BAJO",
                        estado: "ACTIVA",
                        descripcion: `El stock de un producto bajo igual o por debajo del stock mínimo - stock_actual: ${newProduct.stock_actual}, stock_minimo: ${newProduct.stock_minimo}`,
                        producto_id: product.id,
                    },
                    update: {}
                })
            }

            return ProductEntity.fromObject(newProduct);
        }
    }

    async getAll(filterProductDto: FilterProductDto): Promise<ProductExtendedEntity[]> {
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
        const products = await prisma.producto.findMany({
            where: where,
            include: {
                alertas: true,
                historial: true,
                ordenes_compra: true
            }
        });
        console.log(products);
        return products.map(product => ProductExtendedEntity.fromObject(product));
    }

    async findById(id: number): Promise<ProductExtendedEntity> {
        try {
            const product = await prisma.producto.findFirst({
                where: { id },
                include: {
                    historial: true,
                    alertas: true,
                    ordenes_compra: true
                }
            });
            if (!product) throw `Producto con el id: ${id} no fue encontrado`;
            console.log({ product })
            return ProductExtendedEntity.fromObject(product);
        } catch (error) {
            console.log({ error });
            throw `Producto con el id: ${id} no fue encontrado`;
        }
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