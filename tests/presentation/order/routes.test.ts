import request from 'supertest';
import { testServer } from '../../test-server.ts';
import { prisma } from '../../../src/data/postgres/index.ts';
import { seedProductsData } from '../../../src/data/const/seed_products.ts';

describe("Testing in order routes", () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.productHistory.deleteMany();
        await prisma.alerts.deleteMany();
        await prisma.purchaseOrder.deleteMany();
        await prisma.producto.deleteMany();
    });

    const [product1] = seedProductsData;

    test("debe crear una nueva orden /api/orders", async () => {

        const product = await prisma.producto.create({ data: product1! });

        // La política de la empresa exige cantidad_solicitada >= 2 * stock_minimo del producto.
        // product1.stock_minimo = 50, por lo tanto el mínimo es 100.
        const { body } = await request(testServer.app)
            .post("/api/orders")
            .send({ producto_id: product.id, cantidad_solicitada: 100 })
            .expect(200);

        expect(body).toMatchObject({
            id: expect.any(String),
            estado: "PENDIENTE",
            cantidad_solicitada: 100,
            producto_id: product.id,
            proveedor: product1!.proveedor,
            createdAt: expect.any(String),
        });
    });

    test("debe retornar un error 400 con errores de validación cuando el payload está vacío /api/orders", async () => {

        const { body } = await request(testServer.app)
            .post("/api/orders")
            .send({})
            .expect(400);

        expect(body).toEqual({
            errors: [
                "producto_id: El 'producto_id' debe ser numerico",
                "cantidad_solicitada: La 'cantidad_solicitada' es requerido",
            ]
        });
    });

    test("debe retornar un error 400 cuando cantidad_solicitada no es mayor a 0 /api/orders", async () => {

        const product = await prisma.producto.create({ data: product1! });

        const { body } = await request(testServer.app)
            .post("/api/orders")
            .send({ producto_id: product.id, cantidad_solicitada: -5 })
            .expect(400);

        expect(body).toEqual({
            errors: [
                "cantidad_solicitada: Debe ser mayor a 0",
            ]
        });
    });

    test("debe retornar un error 400 cuando el producto no existe /api/orders", async () => {

        const { body } = await request(testServer.app)
            .post("/api/orders")
            .send({ producto_id: 999999, cantidad_solicitada: 10 })
            .expect(400);

        expect(body).toHaveProperty("error");
    });

    test("debe aprobar una orden en estado PENDIENTE /api/orders/:id", async () => {

        const product = await prisma.producto.create({ data: product1! });
        const order = await prisma.purchaseOrder.create({
            data: {
                estado: "PENDIENTE",
                cantidad_solicitada: 10,
                proveedor: product1!.proveedor,
                producto_id: product.id,
            }
        });

        const { body } = await request(testServer.app)
            .put(`/api/orders/${order.id}`)
            .send({ type_action: "aprobar" })
            .expect(200);

        expect(body).toMatchObject({
            id: order.id,
            estado: "APROBADA",
        });
    });

    test("debe rechazar una orden en estado PENDIENTE con un motivo válido /api/orders/:id", async () => {

        const product = await prisma.producto.create({ data: product1! });
        const order = await prisma.purchaseOrder.create({
            data: {
                estado: "PENDIENTE",
                cantidad_solicitada: 10,
                proveedor: product1!.proveedor,
                producto_id: product.id,
            }
        });

        const { body } = await request(testServer.app)
            .put(`/api/orders/${order.id}`)
            .send({ type_action: "rechazar", motivo: "Precio fuera de rango acordado" })
            .expect(200);

        expect(body).toMatchObject({
            id: order.id,
            estado: "RECHAZADA",
            motivo: "Precio fuera de rango acordado",
        });
    });

    test("debe recibir una orden en estado APROBADA /api/orders/:id", async () => {

        const product = await prisma.producto.create({ data: product1! });
        const order = await prisma.purchaseOrder.create({
            data: {
                estado: "APROBADA",
                cantidad_solicitada: 10,
                proveedor: product1!.proveedor,
                producto_id: product.id,
            }
        });

        const { body } = await request(testServer.app)
            .put(`/api/orders/${order.id}`)
            .send({ type_action: "recibir" })
            .expect(200);

        expect(body).toMatchObject({
            id: order.id,
            estado: "RECIBIDA",
        });
    });

    test("debe retornar un error 400 cuando type_action es requerido /api/orders/:id", async () => {

        const product = await prisma.producto.create({ data: product1! });
        const order = await prisma.purchaseOrder.create({
            data: {
                estado: "PENDIENTE",
                cantidad_solicitada: 10,
                proveedor: product1!.proveedor,
                producto_id: product.id,
            }
        });

        const { body } = await request(testServer.app)
            .put(`/api/orders/${order.id}`)
            .send({})
            .expect(400);

        expect(body).toEqual({
            errors: [
                "type_action: El 'typeAction' debe ser 'aprobar', 'rechazar' o 'recibir'",
            ]
        });
    });

    test("debe retornar un error 400 cuando motivo es requerido al rechazar una orden /api/orders/:id", async () => {

        const product = await prisma.producto.create({ data: product1! });
        const order = await prisma.purchaseOrder.create({
            data: {
                estado: "PENDIENTE",
                cantidad_solicitada: 10,
                proveedor: product1!.proveedor,
                producto_id: product.id,
            }
        });

        const { body } = await request(testServer.app)
            .put(`/api/orders/${order.id}`)
            .send({ type_action: "rechazar" })
            .expect(400);

        expect(body).toEqual({
            errors: [
                "motivo: El 'motivo' es requerido cuando se rechaza",
            ]
        });
    });

    test("debe retornar un error 400 cuando motivo tiene menos de 10 caracteres al rechazar una orden /api/orders/:id", async () => {

        const product = await prisma.producto.create({ data: product1! });
        const order = await prisma.purchaseOrder.create({
            data: {
                estado: "PENDIENTE",
                cantidad_solicitada: 10,
                proveedor: product1!.proveedor,
                producto_id: product.id,
            }
        });

        const { body } = await request(testServer.app)
            .put(`/api/orders/${order.id}`)
            .send({ type_action: "rechazar", motivo: "corto" })
            .expect(400);

        expect(body).toEqual({
            errors: [
                "motivo: Minimo deben ser 10 caracteres",
            ]
        });
    });

    test("debe retornar un error 400 cuando type_action tiene un valor inválido /api/orders/:id", async () => {

        const product = await prisma.producto.create({ data: product1! });
        const order = await prisma.purchaseOrder.create({
            data: {
                estado: "PENDIENTE",
                cantidad_solicitada: 10,
                proveedor: product1!.proveedor,
                producto_id: product.id,
            }
        });

        const { body } = await request(testServer.app)
            .put(`/api/orders/${order.id}`)
            .send({ type_action: "cancelar" })
            .expect(400);

        expect(body).toEqual({
            errors: [
                "type_action: El 'typeAction' debe ser 'aprobar', 'rechazar' o 'recibir'",
            ]
        });
    });

    test("debe retornar un error 400 cuando la orden no existe /api/orders/:id", async () => {

        const { body } = await request(testServer.app)
            .put("/api/orders/orden-inexistente-uuid-99999")
            .send({ type_action: "aprobar" })
            .expect(400);

        expect(body).toHaveProperty("error");
    });

});