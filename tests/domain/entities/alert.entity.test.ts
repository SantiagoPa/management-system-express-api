import { describe, it, expect } from 'vitest';
import { AlertEntity } from '../../../src/domain/entities/alert.entity.ts';

const validAlert = {
    id: 1,
    tipo: 'STOCK_BAJO',
    estado: 'ACTIVA',
    descripcion: 'El stock esta por debajo del minimo',
    producto_id: 1,
    createdAt: new Date('2026-01-01'),
};

describe('AlertEntity.fromObject', () => {

    it('crea la entidad correctamente cuando el objeto es valido', () => {
        const alert = AlertEntity.fromObject(validAlert);

        expect(alert).toBeInstanceOf(AlertEntity);
        expect(alert.estado).toBe('ACTIVA');
        expect(alert.tipo).toBe('STOCK_BAJO');
    });

    it('asigna updatedAt cuando viene una fecha valida', () => {
        const alert = AlertEntity.fromObject({ ...validAlert, updatedAt: '2026-02-01' });

        expect(alert.updatedAt).toBe('2026-02-01');
    });

    it('lanza un error cuando updatedAt no es una fecha valida', () => {
        expect(() => AlertEntity.fromObject({ ...validAlert, updatedAt: 'no-es-fecha' }))
            .toThrow('la fecha de actualizacion del registro no es valida (updatedAt)');
    });

    it.each([
        ['id', 'ID es requerido'],
        ['tipo', 'tipo es requerido'],
        ['estado', 'estado es requerido'],
        ['descripcion', 'descripcion es requerido'],
        ['producto_id', 'producto_id es requerido'],
        ['createdAt', 'createdAt es requerido'],
    ])('lanza un error cuando falta el campo "%s"', (field, expectedMessage) => {
        const invalidAlert = { ...validAlert, [field]: undefined };

        expect(() => AlertEntity.fromObject(invalidAlert)).toThrow(expectedMessage);
    });

});