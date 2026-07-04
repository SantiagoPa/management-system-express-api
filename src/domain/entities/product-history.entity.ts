import type { TypeProductHistory } from "../../generated/prisma/enums.ts";

export class ProductHistoryEntity {

    constructor(
        public readonly id: string,
        public readonly motivo: string,
        public readonly cantidad: number,
        public readonly tipo: TypeProductHistory,
        public readonly fecha: Date,
        public readonly createdAt: Date,
        public readonly updatedAt?: Date,
    ) { }

    public static fromObject(object: Record<string, any>): ProductHistoryEntity {
        const { id, motivo, cantidad, tipo, fecha, createdAt, updatedAt } = object;
        if (!id) throw "ID es requerido";
        if (!motivo) throw "motivo es requerido";
        if (!cantidad) throw "cantidad es requerido";
        if (!tipo) throw "!tipo es requerido";
        if (!fecha) throw "fecha es requerido";
        if (!createdAt) throw "createdAt es requerido";


        let newUpdatedAt;
        if (updatedAt) {
            newUpdatedAt = new Date(updatedAt);
            if (isNaN(newUpdatedAt.getTime())) throw "la fecha de actualizacion del registro no es valida (updatedAt)";
        }

        return new ProductHistoryEntity(id, motivo, cantidad, tipo, fecha, createdAt, updatedAt)
    }
}