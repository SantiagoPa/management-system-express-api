import { describe, it, expect } from 'vitest';
import { ProductEntity } from '../../../src/domain/entities/product.entity.ts';

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
};

describe('ProductEntity.fromObject', () => {

    it('crea la entidad correctamente cuando el objeto es valido', () => {
        const product = ProductEntity.fromObject(validProduct);

        expect(product).toBeInstanceOf(ProductEntity);
        expect(product.id).toBe(validProduct.id);
        expect(product.nombre).toBe(validProduct.nombre);
        expect(product.codigo_sku).toBe(validProduct.codigo_sku);
        expect(product.categoria).toBe(validProduct.categoria);
        expect(product.precio).toBe(validProduct.precio);
        expect(product.stock_actual).toBe(validProduct.stock_actual);
        expect(product.stock_minimo).toBe(validProduct.stock_minimo);
        expect(product.proveedor).toBe(validProduct.proveedor);
        expect(product.updatedAt).toBeUndefined();
    });

    it('asigna updatedAt cuando viene una fecha valida', () => {
        const product = ProductEntity.fromObject({ ...validProduct, updatedAt: '2026-02-01T00:00:00.000Z' });

        expect(product.updatedAt).toBe('2026-02-01T00:00:00.000Z');
    });

    it('lanza un error cuando updatedAt no es una fecha valida', () => {
        expect(() => ProductEntity.fromObject({ ...validProduct, updatedAt: 'fecha-invalida' }))
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
    ])('lanza un error cuando falta el campo "%s"', (field, expectedMessage) => {
        const invalidProduct = { ...validProduct, [field]: undefined };
        expect(() => ProductEntity.fromObject(invalidProduct)).toThrow(expectedMessage);
    });

});