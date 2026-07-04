import { ProductAlertsEntity } from "./product-alerts.entity.ts";
import { ProductHistoryEntity } from "./product-history.entity.ts";
import { PurchaseOrdersEntity } from "./purchase-orders.entity.ts";

export class ProductExtendedEntity {

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
        public readonly historial: ProductHistoryEntity[],
        public readonly alertas: ProductAlertsEntity[],
        public readonly ordenes_compra: PurchaseOrdersEntity[],
        public readonly updatedAt?: Date,
    ) { }

    public static fromObject(object: Record<string, any>): ProductExtendedEntity {
        const { id, nombre, codigo_sku, categoria, precio, stock_actual, stock_minimo, proveedor, createdAt, updatedAt, historial, alertas, ordenes_compra } = object;
        if (!id) throw "ID es requerido";
        if (!nombre) throw "nombre es requerido";
        if (!codigo_sku) throw "codigo_sku es requerido";
        if (!categoria) throw "categoria es requerido";
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

        if (!historial) throw "historial es requerido";
        if (!alertas) throw "alertas es requerido";
        if (!ordenes_compra) throw "ordenes_compra es requerido";

        const historialEntity = historial.map((history: Record<string, any>) => ProductHistoryEntity.fromObject(history));
        const alertasEntity = alertas.map((alert: Record<string, any>) => ProductAlertsEntity.fromObject(alert));
        const ordenesCompraEntity = ordenes_compra.map((orders: Record<string, any>) => PurchaseOrdersEntity.fromObject(orders));

        return new ProductExtendedEntity(id, nombre, codigo_sku, categoria, precio, stock_actual, stock_minimo, proveedor, createdAt, historialEntity, alertasEntity, ordenesCompraEntity, updatedAt)
    }

}
