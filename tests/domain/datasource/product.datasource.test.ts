import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock del cliente de Prisma. La ruta debe resolver al mismo archivo que
// importa "product.datasource.impl.ts" (src/data/postgres/index.ts).
// Se usa vi.hoisted porque vi.mock se eleva (hoist) al inicio del archivo,
// antes de cualquier "const" normal.
const { prismaMock } = vi.hoisted(() => {
    return {
        prismaMock: {
            producto: {
                create: vi.fn(),
                update: vi.fn(),
                findMany: vi.fn(),
                findFirst: vi.fn(),
                deleteMany: vi.fn(),
                createMany: vi.fn(),
            },
            productHistory: {
                create: vi.fn(),
            },
            alerts: {
                findFirst: vi.fn(),
                update: vi.fn(),
                create: vi.fn(),
            },
            purchaseOrder: {
                create: vi.fn(),
            },
        },
    };
});

vi.mock('../../../src/data/postgres/index.ts', () => ({
    prisma: prismaMock,
}));

import { ProductDatasourceImpl } from '../../../src/infrastructure/datasource/product.datasource.impl.ts';
import { CustomError } from '../../../src/domain/error/custom-error.ts';

const baseProductRecord = {
    id: 1,
    nombre: 'Coca Cola 1.5L',
    codigo_sku: 'BEB-001',
    categoria: 'Bebidas',
    precio: 5000,
    stock_actual: 20,
    stock_minimo: 5,
    proveedor: 'Distribuidora ABC',
    createdAt: new Date('2026-01-01'),
    historial: [],
    alertas: [],
    ordenes_compra: [],
};

describe('ProductDatasourceImpl', () => {
    let datasource: ProductDatasourceImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        datasource = new ProductDatasourceImpl();
    });

    describe('create', () => {
        it('crea un producto y lo retorna como ProductEntity', async () => {
            prismaMock.producto.create.mockResolvedValue(baseProductRecord);

            const result = await datasource.create({
                nombre: baseProductRecord.nombre,
                codigo_sku: baseProductRecord.codigo_sku,
                categoria: baseProductRecord.categoria,
                precio: baseProductRecord.precio,
                stock_actual: baseProductRecord.stock_actual,
                stock_minimo: baseProductRecord.stock_minimo,
                proveedor: baseProductRecord.proveedor,
            } as any);

            expect(prismaMock.producto.create).toHaveBeenCalledOnce();
            expect(result.id).toBe(baseProductRecord.id);
        });
    });

    describe('findById', () => {
        it('retorna el producto cuando existe', async () => {
            prismaMock.producto.findFirst.mockResolvedValue(baseProductRecord);

            const result = await datasource.findById(1);

            expect(result.id).toBe(1);
        });

        it('lanza CustomError 400 cuando el producto no existe', async () => {
            prismaMock.producto.findFirst.mockResolvedValue(null);

            const promise = datasource.findById(999);

            await expect(promise).rejects.toBeInstanceOf(CustomError);
            await expect(promise).rejects.toMatchObject({
                statusCode: 400,
                message: 'Producto con el id: 999 no fue encontrado',
            });
        });
    });

    describe('getAll', () => {
        it('construye el where con todos los filtros y solo trae productos activos', async () => {
            prismaMock.producto.findMany.mockResolvedValue([baseProductRecord]);

            await datasource.getAll({
                categoria: 'Bebidas',
                proveedor: 'Distribuidora ABC',
                estado_alerta: 'ACTIVA',
                rango_stock: [1, 50],
            } as any);

            expect(prismaMock.producto.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        categoria: 'Bebidas',
                        proveedor: 'Distribuidora ABC',
                        activo: true,
                        stock_actual: { gte: 1, lte: 50 },
                        alertas: { some: { estado: 'ACTIVA' } },
                    }),
                }),
            );
        });

        it('no agrega filtros opcionales cuando no vienen en el dto', async () => {
            prismaMock.producto.findMany.mockResolvedValue([]);

            await datasource.getAll({} as any);

            const callArgs = prismaMock.producto.findMany.mock.calls[0]![0];
            expect(callArgs.where).toEqual({ activo: true });
        });
    });

    describe('updateAmountById - entrada', () => {
        it('suma el stock y no consulta alertas si el stock resultante no supera el minimo', async () => {
            prismaMock.producto.findFirst.mockResolvedValue({ ...baseProductRecord, stock_actual: 2, stock_minimo: 10 });
            prismaMock.producto.update.mockResolvedValue({ ...baseProductRecord, stock_actual: 5 });
            prismaMock.productHistory.create.mockResolvedValue({});

            await datasource.updateAmountById({ id: 1, operacion: 'entrada', cantidad: 3, motivo: 'reposicion' } as any);

            expect(prismaMock.alerts.findFirst).not.toHaveBeenCalled();
        });

        it('cierra la alerta activa si el stock resultante supera el minimo', async () => {
            prismaMock.producto.findFirst.mockResolvedValue({ ...baseProductRecord, stock_actual: 2, stock_minimo: 5 });
            prismaMock.producto.update.mockResolvedValue({ ...baseProductRecord, stock_actual: 20 });
            prismaMock.productHistory.create.mockResolvedValue({});
            prismaMock.alerts.findFirst.mockResolvedValue({ id: 'alert-1', estado: 'ACTIVA' });
            prismaMock.alerts.update.mockResolvedValue({});

            await datasource.updateAmountById({ id: 1, operacion: 'entrada', cantidad: 18, motivo: 'reposicion' } as any);

            expect(prismaMock.alerts.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'alert-1' },
                    data: expect.objectContaining({ estado: 'RESUELTA' }),
                }),
            );
        });

        it('no cierra la alerta si existe pero ya esta RESUELTA', async () => {
            prismaMock.producto.findFirst.mockResolvedValue({ ...baseProductRecord, stock_actual: 2, stock_minimo: 5 });
            prismaMock.producto.update.mockResolvedValue({ ...baseProductRecord, stock_actual: 20 });
            prismaMock.productHistory.create.mockResolvedValue({});
            prismaMock.alerts.findFirst.mockResolvedValue({ id: 'alert-1', estado: 'RESUELTA' });

            await datasource.updateAmountById({ id: 1, operacion: 'entrada', cantidad: 18, motivo: 'reposicion' } as any);

            expect(prismaMock.alerts.update).not.toHaveBeenCalled();
        });

        it('no intenta cerrar ninguna alerta si no existe ninguna', async () => {
            prismaMock.producto.findFirst.mockResolvedValue({ ...baseProductRecord, stock_actual: 2, stock_minimo: 5 });
            prismaMock.producto.update.mockResolvedValue({ ...baseProductRecord, stock_actual: 20 });
            prismaMock.productHistory.create.mockResolvedValue({});
            prismaMock.alerts.findFirst.mockResolvedValue(null);

            await datasource.updateAmountById({ id: 1, operacion: 'entrada', cantidad: 18, motivo: 'reposicion' } as any);

            expect(prismaMock.alerts.update).not.toHaveBeenCalled();
        });
    });

    describe('updateAmountById - salida', () => {
        it('lanza CustomError si la cantidad de salida supera el stock actual', async () => {
            prismaMock.producto.findFirst.mockResolvedValue({ ...baseProductRecord, stock_actual: 5, stock_minimo: 2 });

            await expect(
                datasource.updateAmountById({ id: 1, operacion: 'salida', cantidad: 10, motivo: 'venta' } as any),
            ).rejects.toMatchObject({
                statusCode: 400,
                message: 'La cantidad a de salida (10) es mayor al stock actual (5)',
            });
        });

        it('crea alerta y orden de compra si el stock cae igual o por debajo del minimo y no hay alerta activa', async () => {
            prismaMock.producto.findFirst.mockResolvedValue({ ...baseProductRecord, stock_actual: 10, stock_minimo: 8 });
            prismaMock.producto.update.mockResolvedValue({ ...baseProductRecord, stock_actual: 3, stock_minimo: 8, proveedor: 'Prov X' });
            prismaMock.productHistory.create.mockResolvedValue({});
            prismaMock.alerts.findFirst.mockResolvedValue(null);
            prismaMock.alerts.create.mockResolvedValue({});
            prismaMock.purchaseOrder.create.mockResolvedValue({});

            await datasource.updateAmountById({ id: 1, operacion: 'salida', cantidad: 7, motivo: 'venta' } as any);

            expect(prismaMock.alerts.create).toHaveBeenCalledOnce();
            expect(prismaMock.purchaseOrder.create).toHaveBeenCalledOnce();
        });

        it('no crea una alerta duplicada si ya existe una activa, pero si crea la orden de compra', async () => {
            prismaMock.producto.findFirst.mockResolvedValue({ ...baseProductRecord, stock_actual: 10, stock_minimo: 8 });
            prismaMock.producto.update.mockResolvedValue({ ...baseProductRecord, stock_actual: 3, stock_minimo: 8 });
            prismaMock.productHistory.create.mockResolvedValue({});
            prismaMock.alerts.findFirst.mockResolvedValue({ id: 'alert-1', estado: 'ACTIVA' });
            prismaMock.purchaseOrder.create.mockResolvedValue({});

            await datasource.updateAmountById({ id: 1, operacion: 'salida', cantidad: 7, motivo: 'venta' } as any);

            expect(prismaMock.alerts.create).not.toHaveBeenCalled();
            expect(prismaMock.purchaseOrder.create).toHaveBeenCalledOnce();
        });

        it('no crea alerta ni orden si el stock resultante queda por encima del minimo', async () => {
            prismaMock.producto.findFirst.mockResolvedValue({ ...baseProductRecord, stock_actual: 20, stock_minimo: 5 });
            prismaMock.producto.update.mockResolvedValue({ ...baseProductRecord, stock_actual: 15, stock_minimo: 5 });
            prismaMock.productHistory.create.mockResolvedValue({});

            await datasource.updateAmountById({ id: 1, operacion: 'salida', cantidad: 5, motivo: 'venta' } as any);

            expect(prismaMock.alerts.findFirst).not.toHaveBeenCalled();
            expect(prismaMock.alerts.create).not.toHaveBeenCalled();
            expect(prismaMock.purchaseOrder.create).not.toHaveBeenCalled();
        });
    });

    describe('seed', () => {
        it('elimina los productos existentes y crea los del seed', async () => {
            prismaMock.producto.deleteMany.mockResolvedValue({ count: 3 });
            prismaMock.producto.createMany.mockResolvedValue({ count: 15 });

            const result = await datasource.seed();

            expect(prismaMock.producto.deleteMany).toHaveBeenCalledOnce();
            expect(prismaMock.producto.createMany).toHaveBeenCalledOnce();
            expect(result).toBe('SEED DE PRODUCTOS EJECUTADO, CANTIDAD DE PRODUCTOS CREADOS: 15');
        });
    });

});