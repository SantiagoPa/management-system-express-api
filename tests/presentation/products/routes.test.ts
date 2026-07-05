import request from 'supertest';
import { testServer } from '../../test-server.ts';
import { prisma } from '../../../src/data/postgres/index.ts';
import { seedProductsData } from '../../../src/data/const/seed_products.ts';

describe("Testing in products routes", () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async () => {
        await prisma.producto.deleteMany();
    });

    const [product1, product2] = seedProductsData;

    test("debe retornar todos los productos /api/products", async () => {

        await prisma.producto.createMany({
            data: [product1!, product2!]
        });

        const { body } = await request(testServer.app)
            .get("/api/products")
            .expect(200);

        expect(body).instanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].codigo_sku).toBe(product1?.codigo_sku);
        expect(body[0].categoria).toBe(product1?.categoria);
        expect(body[0].nombre).toBe(product1?.nombre);
    });

    test("debe retornar un producto por su id /api/products/:id", async () => {

        const product = await prisma.producto.create({
            data: product1!
        });

        const { body } = await request(testServer.app)
            .get(`/api/products/${product.id}`)
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            nombre: product1?.nombre,
            codigo_sku: product1?.codigo_sku,
            categoria: product1?.categoria,
            precio: product1?.precio,
            stock_actual: product1?.stock_actual,
            stock_minimo: product1?.stock_minimo,
            proveedor: product1?.proveedor,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            alertas: expect.any(Array),
            historial: expect.any(Array),
            ordenes_compra: expect.any(Array),
        });
    });

    test("debe retornar un error cuando el producto no existe /api/products/:id", async () => {

        const { body } = await request(testServer.app)
            .get(`/api/products/199999`)
            .expect(400);

        expect(body).toEqual({
            error: 'Producto con el id: 199999 no fue encontrado'
        });
    });

    test("debe crear un nuevo producto /api/products", async () => {

        const { body } = await request(testServer.app)
            .post(`/api/products/`)
            .send(product1)
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            nombre: product1?.nombre,
            codigo_sku: product1?.codigo_sku,
            categoria: product1?.categoria,
            precio: product1?.precio,
            stock_actual: product1?.stock_actual,
            stock_minimo: product1?.stock_minimo,
            proveedor: product1?.proveedor,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    test("debe retornar un error cuando el payload del producto está vacío /api/products", async () => {

        const { body } = await request(testServer.app)
            .post(`/api/products/`)
            .send({})
            .expect(400);

        expect(body).toEqual({
            errors: [
                "nombre: El 'nombre' es requerido",
                "codigo_sku: El 'codigo_sku' es requerido",
                "categoria: La 'categoria' debe ser una de las siguientes opciones: Bebidas, Lacteos, Snacks, Limpieza, Frutas, Granos",
                "precio: El 'precio' es requerido",
                "stock_actual: El 'stock_actual' es requerido",
                "stock_minimo: El 'stock_minimo' es requerido",
                "proveedor: El 'proveedor' es requerido",
            ],
        });
    });

    test("debe actualizar el producto realizando una entrada de inventario /api/products/:id/inventory-adjustment", async () => {

        const product = await prisma.producto.create({
            data: product1!
        });

        const { body } = await request(testServer.app)
            .put(`/api/products/${product.id}/inventory-adjustment`)
            .send({ cantidad: 10, operacion: "entrada", motivo: "compra a proveedor" })
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            nombre: product1?.nombre,
            codigo_sku: product1?.codigo_sku,
            categoria: product1?.categoria,
            precio: product1?.precio,
            stock_actual: product1?.stock_actual! + 10,
            stock_minimo: product1?.stock_minimo,
            proveedor: product1?.proveedor,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    test("debe actualizar el producto realizando una salida de inventario /api/products/:id/inventory-adjustment", async () => {

        const product = await prisma.producto.create({
            data: product1!
        });

        const { body } = await request(testServer.app)
            .put(`/api/products/${product.id}/inventory-adjustment`)
            .send({ cantidad: 10, operacion: "salida", motivo: "venta a proveedor" })
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            nombre: product1?.nombre,
            codigo_sku: product1?.codigo_sku,
            categoria: product1?.categoria,
            precio: product1?.precio,
            stock_actual: product1?.stock_actual! - 10,
            stock_minimo: product1?.stock_minimo,
            proveedor: product1?.proveedor,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    test("debe retornar un error cuando el payload para el ajuste de inventario está vacío /api/products/:id/inventory-adjustment", async () => {

        const product = await prisma.producto.create({
            data: product1!
        });

        const { body } = await request(testServer.app)
            .put(`/api/products/${product.id}/inventory-adjustment`)
            .send({})
            .expect(400);

        expect(body).toEqual({
            errors: [
                "motivo: El 'motivo' es requerido",
                "operacion: La 'operacion' debe ser 'entrada' o 'salida'",
                "cantidad: La 'cantidad' es requerida",
            ],
        });
    });

    test("debe ejecutar el seed de productos /api/products/seed", async () => {

        const { body } = await request(testServer.app)
            .post(`/api/products/seed`)
            .send({})
            .expect(200);

        expect(body).toBe("SEED DE PRODUCTOS EJECUTADO, CANTIDAD DE PRODUCTOS CREADOS: 6");
    });

        test("debe ejecutar el seed de productos /api/products/seed", async () => {

        const { body } = await request(testServer.app)
            .post(`/api/products/seed`)
            .send({})
            .expect(200);

        expect(body).toBe("SEED DE PRODUCTOS EJECUTADO, CANTIDAD DE PRODUCTOS CREADOS: 6");
    });


});