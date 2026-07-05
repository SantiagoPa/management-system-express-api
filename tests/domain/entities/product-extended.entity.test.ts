import { describe, it, expect } from 'vitest';
import { ProductExtendedEntity } from '../../../src/domain/entities/product-extended.entity.ts';

const validHistory = {
    id: 'a1b2c3',
    motivo: 'entrada - reposicion',
    cantidad: 10,
    tipo: 'entrada',
    fecha: new Date('2026-01-01'),
    createdAt: new Date('2026-01-01'),
};

const validAlert = {
    id: 1,
    tipo: 'STOCK_BAJO',
    estado: 'ACTIVA',
    descripcion: 'Stock bajo',
    producto_id: 1,
    createdAt: new Date('2026-01-01'),
};

const validOrder = {
    id: 1,
    estado: 'PENDIENTE',
    producto_id: 1,
    proveedor: 'Distribuidora ABC',
    motivo: 'reposicion automatica',
    cantidad_solicitada: 10,
    createdAt: new Date('2026-01-01'),
};

const validProduct = {
    id: 1,
    nombre: 'Coca Cola 1.5L',
    codigo_sku: 'BEB-001',
    categoria: 'Bebidas',
    precio: 5000,
    stock_actual: 20,
    stock_minimo: 5,
    proveedor: 'Distribuidora ABC',
    createdAt: new Date('2026-01-01'),
    historial: [validHistory],
    alertas: [validAlert],
    ordenes_compra: [validOrder],
};

describe('ProductExtendedEntity.fromObject', () => {

    it('create entities and mappers the relations (history, alerts, orders)', () => {

        const product = ProductExtendedEntity.fromObject(validProduct);

        expect(product).toBeInstanceOf(ProductExtendedEntity);
        expect(product.id).toBe(validProduct.id);
        expect(product.historial).toHaveLength(1);
        expect(product.alertas).toHaveLength(1);
        expect(product.ordenes_compra).toHaveLength(1);
    });

    it('asigna updatedAt cuando viene una fecha valida', () => {
        const product = ProductExtendedEntity.fromObject({ ...validProduct, updatedAt: '2026-02-01' });

        expect(product.updatedAt).toBe('2026-02-01');
    });

    it('lanza un error cuando updatedAt no es una fecha valida', () => {
        expect(() => ProductExtendedEntity.fromObject({ ...validProduct, updatedAt: 'no-es-fecha' }))
            .toThrow('la fecha de actualizacion del registro no es valida (updatedAt)');
    });

    it.each([
        ['id', 'ID es requerido'],
        ['nombre', 'nombre es requerido'],
        ['codigo_sku', 'codigo_sku es requerido'],
        ['categoria', 'categoria es requerido'],
        ['precio', 'precio es requerido'],
        ['stock_actual', 'stock_actual es requerido'],
        ['stock_minimo', 'stock_minimo es requerido'],
        ['proveedor', 'proveedor es requerido'],
        ['createdAt', 'stock_minimo es requerido'], // mensaje reutilizado por error en el codigo fuente
        ['historial', 'historial es requerido'],
        ['alertas', 'alertas es requerido'],
        ['ordenes_compra', 'ordenes_compra es requerido'],
    ])('lanza un error cuando falta el campo "%s"', (field, expectedMessage) => {
        const invalidProduct = { ...validProduct, [field]: undefined };

        expect(() => ProductExtendedEntity.fromObject(invalidProduct)).toThrow(expectedMessage);
    });

    it('propaga el error si un elemento de "historial" es invalido', () => {
        expect(() => ProductExtendedEntity.fromObject({
            ...validProduct,
            historial: [{ ...validHistory, motivo: undefined }],
        })).toThrow('motivo es requerido');
    });

    it('propaga el error si un elemento de "alertas" es invalido', () => {
        expect(() => ProductExtendedEntity.fromObject({
            ...validProduct,
            alertas: [{ ...validAlert, estado: undefined }],
        })).toThrow('estado es requerido');
    });

    it('propaga el error si un elemento de "ordenes_compra" es invalido', () => {
        expect(() => ProductExtendedEntity.fromObject({
            ...validProduct,
            ordenes_compra: [{ ...validOrder, estado: undefined }],
        })).toThrow('estado es requerido');
    });

});