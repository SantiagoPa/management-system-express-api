import { StatusAlert, TypeAlert } from "../../generated/prisma/enums.ts"

export class AlertEntity {

    constructor(
        public readonly id: number,
        public readonly tipo: TypeAlert,
        public readonly estado: StatusAlert,
        public readonly descripcion: string,
        public readonly producto_id: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    public static fromObject(object: Record<string, any>): AlertEntity {
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

        return new AlertEntity(id, tipo, estado, descripcion, producto_id, createdAt, updatedAt);
    }

}
