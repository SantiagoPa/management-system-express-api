import type { StatusPurchaseOrder } from "../../generated/prisma/enums.ts";

export class PurchaseOrdersEntity {
    constructor(
        public readonly id: string,
        public readonly proveedor: string,
        public readonly producto_id: number,
        public readonly estado: StatusPurchaseOrder,
        public readonly cantidad_solicitada: number,
        public readonly createdAt: Date,
        public readonly updatedAt?: Date,
    ) { }

    public static fromObject(object: Record<string, any>): PurchaseOrdersEntity {
        const { id, proveedor, producto_id, estado, cantidad_solicitada, createdAt, updatedAt } = object;
        if (!id) throw "ID es requerido";
        if (!proveedor) throw "proveedor es requerido";
        if (!producto_id) throw "producto_id es requerido";
        if (!estado) throw "estado es requerido";
        if (!cantidad_solicitada) throw "cantidad_solicitada es requerido";
        if (!createdAt) throw "createdAt es requerido";

        let newUpdatedAt;
        if (updatedAt) {
            newUpdatedAt = new Date(updatedAt);
            if (isNaN(newUpdatedAt.getTime())) throw "la fecha de actualizacion del registro no es valida (updatedAt)";
        }

        return new PurchaseOrdersEntity(id, proveedor, producto_id, estado, cantidad_solicitada, createdAt, updatedAt)
    }
}