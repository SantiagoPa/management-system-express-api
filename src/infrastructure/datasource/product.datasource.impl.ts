import { seedProductsData } from "../../data/const/seed_products.ts";
import { prisma } from "../../data/postgres/index.ts";
import { ProductExtendedEntity } from "../../domain/entities/product-extended.entity.ts";

import { ProductEntity, type CreateProductDto, type ProductDatasource } from "../../domain/index.ts";
import type { FilterProductDto } from "../../domain/dtos/products/filter-product.dto.ts";
import type { UpdateAmountProductDto } from "../../domain/dtos/products/update-amount-prodcut.dto.ts";
import type { Prisma } from "../../generated/prisma/client.ts";
import { CustomError } from "../../domain/error/custom-error.ts";

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

            // Cierre automático de alerta si el stock subió por encima del mínimo
            if (addition > product.stock_minimo) {

                const alert = await prisma.alerts.findFirst({ where: { producto_id: product.id } });

                if (alert && alert.estado === "ACTIVA") {
                    await prisma.alerts.update({
                        where: { id: alert.id },
                        data: {
                            estado: "RESUELTA",
                            descripcion: `Alerta resuelta - stock_actual: ${addition}, stock_minimo: ${product.stock_minimo}`,
                        },
                    })
                }
            }

            return ProductEntity.fromObject(newProduct);

        } else {
            // salida
            const subtraction = product.stock_actual - cantidad;

            if (subtraction < 0) throw new CustomError(400, `La cantidad a de salida (${cantidad}) es mayor al stock actual (${product.stock_actual})`);


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


            // Generar alerta si el stock bajó igual o por debajo del mínimo y generar orden
            if (subtraction <= product.stock_minimo) {

                const activeAlert = await prisma.alerts.findFirst({
                    where: { producto_id: id, estado: "ACTIVA" }
                });

                // Solo crear si NO existe ya una alerta activa (una activa por producto)
                if (!activeAlert) {
                    await prisma.alerts.create({
                        data: {
                            tipo: "STOCK_BAJO",
                            estado: "ACTIVA",
                            descripcion: `El stock bajó igual o por debajo del mínimo - stock_actual: ${subtraction}, stock_minimo: ${product.stock_minimo}`,
                            producto_id: id,
                        }
                    });
                }

                await prisma.purchaseOrder.create({
                    data: {
                        estado: "PENDIENTE",
                        proveedor: newProduct.proveedor,
                        producto_id: newProduct.id,
                        cantidad_solicitada: newProduct.stock_minimo * 2
                    }
                });
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
            where: {
                ...where,
                activo: true,
            },
            include: {
                alertas: true,
                historial: true,
                ordenes_compra: true
            }
        });
        return products.map(product => ProductExtendedEntity.fromObject(product));
    }

    async findById(id: number): Promise<ProductExtendedEntity> {
        const product = await prisma.producto.findFirst({
            where: { id },
            include: {
                historial: true,
                alertas: true,
                ordenes_compra: true
            }
        });
        if (!product) throw new CustomError(400, `Producto con el id: ${id} no fue encontrado`);
        return ProductExtendedEntity.fromObject(product);
    }

    async updateById(id: number): Promise<ProductEntity> {
        throw new Error("Method not implemented.");
    }

    async deleteById(id: number): Promise<ProductEntity> {
        await this.findById(id);
        const product = await prisma.producto.update({
            where: { id },
            data: {
                activo: false
            }
        });
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