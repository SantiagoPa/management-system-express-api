import { StatusPurchaseOrder } from "../../generated/prisma/enums.ts"

export class OrderEntity {

    constructor(
        public readonly id: number,
        public readonly estado: StatusPurchaseOrder,
        public readonly producto_id: number,
        public readonly proveedor: string,
        public readonly cantidad_solicitada: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    public static fromObject(object: Record<string, any>): OrderEntity {
        const { id, estado, producto_id, proveedor, cantidad_solicitada, createdAt, updatedAt } = object;
        if (!id) throw "ID es requerido";
        if (!estado) throw "estado es requerido";
        if (!producto_id) throw "producto_id es requerido";
        if (!proveedor) throw "proveedor es requerido";
        if (!cantidad_solicitada) throw "cantidad_solicitada es requerido";
        if (!proveedor) throw "proveedor es requerido";
        if (!createdAt) throw "stock_minimo es requerido";

        let newUpdatedAt;
        if (updatedAt) {
            newUpdatedAt = new Date(updatedAt);
            if (isNaN(newUpdatedAt.getTime())) throw "la fecha de actualizacion del registro no es valida (updatedAt)";
        }

        return new OrderEntity(id, estado, producto_id, proveedor, cantidad_solicitada, createdAt, updatedAt)
    }

}
