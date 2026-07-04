import type { StatusAlert } from "../../generated/prisma/enums.ts";

export class ProductAlertsEntity {

    constructor(
  
        public readonly id: string,
        public readonly tipo: "STOCK_BAJO",
        public readonly estado: StatusAlert,
        public readonly descripcion: string,
        public readonly producto_id: number,
        public readonly createdAt: Date,
        public readonly updatedAt?: Date,

    ) { }

     public static fromObject(object: Record<string, any>): ProductAlertsEntity {
        const { id, tipo, estado, descripcion, producto_id, createdAt, updatedAt } = object;
        if (!id) throw "ID es requerido";
        if (!tipo) throw "tipo es requerido";
        if (!estado) throw "estado es requerido";
        if (!descripcion) throw "descripcion es requerido";
        if (!producto_id) throw "producto_id es requerido";
        if (!createdAt) throw "createdAt es requerido";

        let newUpdatedAt;
        if (updatedAt) {
            newUpdatedAt = new Date(updatedAt);
            if (isNaN(newUpdatedAt.getTime())) throw "la fecha de actualizacion del registro no es valida (updatedAt)";
        }
        
        return new ProductAlertsEntity(id, tipo, estado, descripcion, producto_id, createdAt, updatedAt )
    }
}