import { describe, it, expect } from 'vitest';
import { ProductHistoryEntity } from '../../../src/domain/entities/product-history.entity.ts';

const validHistory = {
    id: 'a1b2c3',
    motivo: 'entrada - reposicion',
    cantidad: 10,
    tipo: 'entrada',
    fecha: new Date('2026-01-01'),
    createdAt: new Date('2026-01-01'),
};

describe('ProductHistoryEntity.fromObject', () => {

    it('crea la entidad correctamente cuando el objeto es valido', () => {
        const history = ProductHistoryEntity.fromObject(validHistory);

        expect(history).toBeInstanceOf(ProductHistoryEntity);
        expect(history.motivo).toBe(validHistory.motivo);
        expect(history.cantidad).toBe(10);
    });

    it('asigna updatedAt cuando viene una fecha valida', () => {
        const history = ProductHistoryEntity.fromObject({ ...validHistory, updatedAt: '2026-02-01' });

        expect(history.updatedAt).toBe('2026-02-01');
    });

    it('lanza un error cuando updatedAt no es una fecha valida', () => {
        expect(() => ProductHistoryEntity.fromObject({ ...validHistory, updatedAt: 'no-es-fecha' }))
            .toThrow('la fecha de actualizacion del registro no es valida (updatedAt)');
    });

    it.each([
        ['id', 'ID es requerido'],
        ['motivo', 'motivo es requerido'],
        ['cantidad', 'cantidad es requerido'],
        ['tipo', '!tipo es requerido'], // mensaje con typo tal cual esta en el codigo fuente
        ['fecha', 'fecha es requerido'],
        ['createdAt', 'createdAt es requerido'],
    ])('lanza un error cuando falta el campo "%s"', (field, expectedMessage) => {
        const invalidHistory = { [field]: undefined };

        expect(() => ProductHistoryEntity.fromObject(invalidHistory)).toThrow(expectedMessage);
    });

});