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

    test("should return a new ORDER /api/orders", async () => {

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

    test("should return 400 with validation errors - empty payload /api/orders", async () => {

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

    test("should return 400 with validation error - cantidad_solicitada is not positive /api/orders", async () => {

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

    test("should return 400 error - product does not exist /api/orders", async () => {

        const { body } = await request(testServer.app)
            .post("/api/orders")
            .send({ producto_id: 999999, cantidad_solicitada: 10 })
            .expect(400);

        expect(body).toHaveProperty("error");
    });

    test("should approve a PENDING ORDER /api/orders/:id", async () => {

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

    test("should reject a PENDING ORDER with motivo /api/orders/:id", async () => {

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

    test("should receive an APPROVED ORDER /api/orders/:id", async () => {

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

    test("should return 400 - type_action is required /api/orders/:id", async () => {

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

    test("should return 400 - motivo is required when rejecting /api/orders/:id", async () => {

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

    test("should return 400 - motivo too short when rejecting /api/orders/:id", async () => {

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

    test("should return 400 - invalid type_action /api/orders/:id", async () => {

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

    test("should return 400 error - order does not exist /api/orders/:id", async () => {

        const { body } = await request(testServer.app)
            .put("/api/orders/orden-inexistente-uuid-99999")
            .send({ type_action: "aprobar" })
            .expect(400);

        expect(body).toHaveProperty("error");
    });

});
