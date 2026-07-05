import { describe, it, expect } from 'vitest';
import { OrderEntity } from '../../../src/domain/entities/order.entity.ts';

const validOrder = {
    id: 1,
    estado: 'PENDIENTE',
    producto_id: 1,
    proveedor: 'Distribuidora ABC',
    motivo: 'reposicion automatica',
    cantidad_solicitada: 10,
    createdAt: new Date('2026-01-01'),
};

describe('OrderEntity.fromObject', () => {

    it('crea la entidad correctamente cuando el objeto es valido', () => {
        const order = OrderEntity.fromObject(validOrder);

        expect(order).toBeInstanceOf(OrderEntity);
        expect(order.estado).toBe('PENDIENTE');
        expect(order.cantidad_solicitada).toBe(10);
    });

    // La validacion de "motivo" esta comentada en el codigo fuente, por lo que
    // este test documenta ese comportamiento actual (no lanza error sin motivo).
    it('permite crear la orden sin "motivo" porque no es un campo requerido', () => {
        const order = OrderEntity.fromObject({ ...validOrder, motivo: undefined });

        expect(order.motivo).toBeUndefined();
    });

    it('asigna updatedAt cuando viene una fecha valida', () => {
        const order = OrderEntity.fromObject({ ...validOrder, updatedAt: '2026-02-01' });

        expect(order.updatedAt).toBe('2026-02-01');
    });

    it('lanza un error cuando updatedAt no es una fecha valida', () => {
        expect(() => OrderEntity.fromObject({ ...validOrder, updatedAt: 'no-es-fecha' }))
            .toThrow('la fecha de actualizacion del registro no es valida (updatedAt)');
    });

    it.each([
        ['id', 'ID es requerido'],
        ['estado', 'estado es requerido'],
        ['producto_id', 'producto_id es requerido'],
        ['proveedor', 'proveedor es requerido'],
        ['cantidad_solicitada', 'cantidad_solicitada es requerido'],
        ['createdAt', 'stock_minimo es requerido'], // mensaje reutilizado por error en el codigo fuente
    ])('lanza un error cuando falta el campo "%s"', (field, expectedMessage) => {
        const invalidOrder = { ...validOrder, [field]: undefined };

        expect(() => OrderEntity.fromObject(invalidOrder)).toThrow(expectedMessage);
    });

});