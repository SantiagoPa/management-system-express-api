import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { ProductsController } from '../../../src/presentation/products/controller.ts';
import type { ProductRepository } from '../../../src/domain/repositories/product.repository.ts';
import { CustomError } from '../../../src/domain/error/custom-error.ts';
import { PrismaClientKnownRequestError } from '../../../src/generated/prisma/internal/prismaNamespace.ts';

function createMockResponse() {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res) as any;
    res.json = vi.fn().mockReturnValue(res) as any;
    return res;
}

function flushPromises() {
    return new Promise((resolve) => setImmediate(resolve));
}

// Ajusta el segundo argumento si la firma de PrismaClientKnownRequestError
// difiere en tu version de @prisma/client.
function createUniqueConstraintError(field: string) {
    return new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.8.0',
        meta: {
            driverAdapterError: {
                cause: {
                    originalCode: '23505',
                    constraint: { fields: [field] },
                },
            },
        },
    } as any);
}

function createOtherPrismaError() {
    return new PrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        clientVersion: '7.8.0',
        meta: {
            driverAdapterError: {
                cause: {
                    originalCode: '23503',
                    constraint: { fields: ['producto_id'] },
                },
            },
        },
    } as any);
}

describe('ProductsController', () => {
    let repository: ProductRepository;
    let controller: ProductsController;
    let res: Response;

    beforeEach(() => {
        repository = {
            create: vi.fn(),
            getAll: vi.fn(),
            findById: vi.fn(),
            updateAmountById: vi.fn(),
            seed: vi.fn(),
        } as unknown as ProductRepository;
        controller = new ProductsController(repository);
        res = createMockResponse();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    describe('getProducts', () => {
        it('responde 400 cuando el query no es valido', async () => {
            const req = { query: { categoria: 'CategoriaQueNoExiste' } } as unknown as Request;

            await controller.getProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(repository.getAll).not.toHaveBeenCalled();
        });

        it('responde con la lista de productos cuando el query es valido', async () => {
            const req = { query: {} } as unknown as Request;
            (repository.getAll as any).mockResolvedValue([{ id: 1 }]);

            await controller.getProducts(req, res);
            await flushPromises();

            expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
        });
    });

    describe('getProductById', () => {
        it('responde con el producto encontrado', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            (repository.findById as any).mockResolvedValue({ id: 1 });

            controller.getProductById(req, res);
            await flushPromises();

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe('createProduct', () => {
        it('responde 400 cuando el body no es valido', async () => {
            const req = { body: {} } as unknown as Request;

            await controller.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(repository.create).not.toHaveBeenCalled();
        });

        it('crea el producto cuando el body es valido', async () => {
            const req = {
                body: {
                    nombre: 'Coca Cola 1.5L',
                    codigo_sku: 'BEB-001',
                    categoria: 'Bebidas',
                    precio: 5000,
                    stock_actual: 20,
                    stock_minimo: 5,
                    proveedor: 'Distribuidora ABC',
                },
            } as unknown as Request;
            (repository.create as any).mockResolvedValue({ id: 1 });

            await controller.createProduct(req, res);
            await flushPromises();

            expect(repository.create).toHaveBeenCalledOnce();
            expect(res.json).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe('seedProducts', () => {
        it('ejecuta el seed y responde con el mensaje resultante', async () => {
            const req = {} as Request;
            (repository.seed as any).mockResolvedValue('SEED OK');

            await controller.seedProducts(req, res);
            await flushPromises();

            expect(res.json).toHaveBeenCalledWith('SEED OK');
        });
    });

    describe('inventoryAdjustment', () => {
        it('responde 400 cuando el body no es valido', async () => {
            const req = { params: { id: '1' }, body: {} } as unknown as Request;

            await controller.inventoryAdjustment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(repository.updateAmountById).not.toHaveBeenCalled();
        });

        it('ajusta el inventario cuando el body es valido', async () => {
            const req = {
                params: { id: '1' },
                body: { operacion: 'entrada', cantidad: 5, motivo: 'reposicion' },
            } as unknown as Request;
            (repository.updateAmountById as any).mockResolvedValue({ id: 1 });

            await controller.inventoryAdjustment(req, res);
            await flushPromises();

            expect(repository.updateAmountById).toHaveBeenCalledOnce();
            expect(res.json).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe('manejo de errores (handleError)', () => {
        it('responde 400 con mensaje de "ya existe" cuando Prisma detecta un valor duplicado (codigo 23505)', async () => {
            const req = { query: {} } as unknown as Request;
            (repository.getAll as any).mockRejectedValue(createUniqueConstraintError('codigo_sku'));

            await controller.getProducts(req, res);
            await flushPromises();

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'El codigo_sku que enviaste ya existe!' });
        });

        it('responde 500 cuando el error de Prisma no es un conflicto de unicidad (23505)', async () => {
            const req = { query: {} } as unknown as Request;
            (repository.getAll as any).mockRejectedValue(createOtherPrismaError());

            await controller.getProducts(req, res);
            await flushPromises();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
        });

        it('responde con el statusCode y mensaje propios de un CustomError', async () => {
            const req = { query: {} } as unknown as Request;
            (repository.getAll as any).mockRejectedValue(new CustomError(404, 'Producto no encontrado'));

            await controller.getProducts(req, res);
            await flushPromises();

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
        });

        it('responde 500 ante cualquier otro error inesperado', async () => {
            const req = { query: {} } as unknown as Request;
            (repository.getAll as any).mockRejectedValue(new Error('boom'));

            await controller.getProducts(req, res);
            await flushPromises();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
        });
    });

});