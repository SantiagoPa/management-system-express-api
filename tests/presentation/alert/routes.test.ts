import request from 'supertest';
import { testServer } from '../../test-server.ts';
import { prisma } from '../../../src/data/postgres/index.ts';
import { seedProductsData } from '../../../src/data/const/seed_products.ts';

describe("Testing in alert routes", () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.productHistory.deleteMany();
        await prisma.purchaseOrder.deleteMany();
        await prisma.alerts.deleteMany();
        await prisma.producto.deleteMany();
    });

    const [product1] = seedProductsData;

    test("should return empty array when no alerts exist /api/alerts", async () => {

        const { body } = await request(testServer.app)
            .get("/api/alerts")
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(0);
    });

    test("should return all ALERTS /api/alerts", async () => {

        const product = await prisma.producto.create({ data: product1! });

        await prisma.alerts.createMany({
            data: [
                {
                    tipo: "STOCK_BAJO",
                    estado: "ACTIVA",
                    descripcion: "Stock bajo de producto 1",
                    producto_id: product.id,
                },
                {
                    tipo: "STOCK_BAJO",
                    estado: "RESUELTA",
                    descripcion: "Stock normalizado de producto 1",
                    producto_id: product.id,
                },
            ]
        });

        const { body } = await request(testServer.app)
            .get("/api/alerts")
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
    });

    test("should return only ACTIVA alerts when filtering by estado_alerta=ACTIVA /api/alerts", async () => {

        const product = await prisma.producto.create({ data: product1! });

        await prisma.alerts.createMany({
            data: [
                {
                    tipo: "STOCK_BAJO",
                    estado: "ACTIVA",
                    descripcion: "Stock bajo de producto 1",
                    producto_id: product.id,
                },
                {
                    tipo: "STOCK_BAJO",
                    estado: "RESUELTA",
                    descripcion: "Stock normalizado de producto 1",
                    producto_id: product.id,
                },
            ]
        });

        const { body } = await request(testServer.app)
            .get("/api/alerts?estado_alerta=ACTIVA")
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(1);
        expect(body[0].estado).toBe("ACTIVA");
    });

    test("should return only RESUELTA alerts when filtering by estado_alerta=RESUELTA /api/alerts", async () => {

        const product = await prisma.producto.create({ data: product1! });

        await prisma.alerts.createMany({
            data: [
                {
                    tipo: "STOCK_BAJO",
                    estado: "ACTIVA",
                    descripcion: "Stock bajo de producto 1",
                    producto_id: product.id,
                },
                {
                    tipo: "STOCK_BAJO",
                    estado: "RESUELTA",
                    descripcion: "Stock normalizado de producto 1",
                    producto_id: product.id,
                },
            ]
        });

        const { body } = await request(testServer.app)
            .get("/api/alerts?estado_alerta=RESUELTA")
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(1);
        expect(body[0].estado).toBe("RESUELTA");
    });

    test("should return 400 with validation error for invalid estado_alerta /api/alerts", async () => {

        const { body } = await request(testServer.app)
            .get("/api/alerts?estado_alerta=INVALIDO")
            .expect(400);

        expect(body).toEqual({
            errors: [
                "estado_alerta: El 'estado_alerta' debe ser 'ACTIVA' o 'RESUELTA'",
            ]
        });
    });

    test("should return alert with expected fields /api/alerts", async () => {

        const product = await prisma.producto.create({ data: product1! });

        await prisma.alerts.create({
            data: {
                tipo: "STOCK_BAJO",
                estado: "ACTIVA",
                descripcion: "Stock bajo de producto 1",
                producto_id: product.id,
            }
        });

        const { body } = await request(testServer.app)
            .get("/api/alerts")
            .expect(200);

        expect(body[0]).toMatchObject({
            id: expect.any(String),
            tipo: "STOCK_BAJO",
            estado: "ACTIVA",
            descripcion: expect.any(String),
            producto_id: product.id,
            createdAt: expect.any(String),
        });
    });

});
