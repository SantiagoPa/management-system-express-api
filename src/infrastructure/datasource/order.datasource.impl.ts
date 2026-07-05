import { prisma } from "../../data/postgres/index.ts";
import { OrderEntity } from "../../domain/entities/order.entity.ts";
import { CustomError } from "../../domain/error/custom-error.ts";
import type { CreateOrderDto, OrderDatasource, UpdateStatusOrderDto } from "../../domain/index.ts";

export class OrderDatasourceImpl implements OrderDatasource {

    async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {

        const { producto_id, cantidad_solicitada } = createOrderDto;
        const product = await prisma.producto.findUnique({ where: { id: producto_id } });

        if (!product) throw new CustomError(400, `El producto con el id: ${producto_id}, no fue encontrado`);

        const minAmount = product.stock_minimo * 2;

        if (!(cantidad_solicitada >= minAmount)) throw new CustomError(400, `La cantidad mínima de una orden debe ser al menos 2 veces el stock mínimo del producto (política de la empresa), stock_minimo: ${product.stock_minimo}`)

        const order = await prisma.purchaseOrder.create({
            data: {
                estado: "PENDIENTE",
                proveedor: product.proveedor,
                producto_id: product.id,
                cantidad_solicitada: cantidad_solicitada
            }
        });

        return OrderEntity.fromObject(order);
    }

    async updateStatus(updateOrderDto: UpdateStatusOrderDto): Promise<OrderEntity> {
        const { id, type_action, motivo } = updateOrderDto;

        const order = await prisma.purchaseOrder.findUnique({ where: { id } });

        if (!order) throw new CustomError(400, `Orden de compra con el id: ${id} no existe!`);

        if (type_action === "aprobar" && order.estado === "PENDIENTE") {
            const order = await prisma.purchaseOrder.update({
                where: { id: id },
                data: {
                    estado: "APROBADA"
                }
            });
            return OrderEntity.fromObject(order);
        }

        if (type_action === "rechazar" && order.estado === "PENDIENTE") {
            const order = await prisma.purchaseOrder.update({
                where: { id: id },
                data: {
                    estado: "RECHAZADA",
                    motivo: motivo ?? null
                }
            });
            return OrderEntity.fromObject(order);
        }


        if (type_action === "recibir" && order.estado === "APROBADA") {

            const order = await prisma.purchaseOrder.update({
                where: { id: id },
                data: {
                    estado: "RECIBIDA"
                }
            });

            const product = await prisma.producto.findUnique({ where: { id: order.producto_id } })

            if (product) {
                const promiseProduct = prisma.producto.update({
                    where: { id: order.producto_id },
                    data: {
                        stock_actual: product.stock_actual + order.cantidad_solicitada,
                    }
                });

                const activeAlert = await prisma.alerts.findFirst({ where: { producto_id: product.id, estado: "ACTIVA" } });
                let promiseAlert;

                if (activeAlert) {
                    promiseAlert = prisma.alerts.update({
                        where: { id: activeAlert.id },
                        data: {
                            estado: "RESUELTA",
                            descripcion: `Alerta resuelta - stock_actual: ${product.stock_actual + order.cantidad_solicitada}, stock_minimo: ${product.stock_minimo}`,
                        },
                    })
                }
                await Promise.all([promiseProduct, promiseAlert]);
            }

            return OrderEntity.fromObject(order);
        }

        throw new CustomError(400, `No es posible realizar el siguiente 'type_action': ${type_action}`);
    }

}