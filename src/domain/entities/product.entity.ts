
export class ProductEntity {

    constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly codigo_sku: string,
        public readonly categoria: string,
        public readonly precio: number,
        public readonly stock_actual: number,
        public readonly stock_minimo: number,
        public readonly proveedor: string,
        public readonly createdAt: Date,
        public readonly updatedAt?: Date,
    ) { }

    public static fromObject(object: Record<string, any>): ProductEntity {
        const { id, nombre, codigo_sku, categoria, precio, stock_actual, stock_minimo, proveedor, createdAt, updatedAt } = object;
        if (!id) throw "ID es requerido";
        if (!nombre) throw "nombre es requerido";
        if (!codigo_sku) throw "Id es requerido";
        if (!categoria) throw "Id es requerido";
        if (!precio) throw "precio es requerido";
        if (!stock_actual) throw "stock_actual es requerido";
        if (!stock_minimo) throw "stock_minimo es requerido";
        if (!proveedor) throw "proveedor es requerido";
        if (!createdAt) throw "stock_minimo es requerido";

        let newUpdatedAt;
        if (updatedAt) {
            newUpdatedAt = new Date(updatedAt);
            if (isNaN(newUpdatedAt.getTime())) throw "la fecha de actualizacion del registro no es valida (updatedAt)";
        }

        return new ProductEntity(id, nombre, codigo_sku, categoria, precio, stock_actual, stock_minimo, proveedor, createdAt, updatedAt)
    }

}
