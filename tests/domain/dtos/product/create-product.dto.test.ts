import { CreateProductDto, FilterProductDto, UpdateAmountProductDto } from "../../../../src/domain/index.ts";

describe("Dtos domain/dtos/products testing", () => {

    it("debe retornar un arreglo de errores - no se proporcionó un payload válido [CreateProductDto]", () => {

        const [error] = CreateProductDto.create({});

        expect(error).toEqual(
            [
                "nombre: El 'nombre' es requerido",
                "codigo_sku: El 'codigo_sku' es requerido",
                "categoria: La 'categoria' debe ser una de las siguientes opciones: Bebidas, Lacteos, Snacks, Limpieza, Frutas, Granos",
                "precio: El 'precio' es requerido",
                "stock_actual: El 'stock_actual' es requerido",
                "stock_minimo: El 'stock_minimo' es requerido",
                "proveedor: El 'proveedor' es requerido",
            ]
        );
    });

    it("debe retornar un arreglo de errores - se proporciona un payload inválido [FilterProductDto]", () => {

        const [error] = FilterProductDto.create({
            categoria: "B",
            proveedor: 123,
            estado_alerta: "ACTIVa",
            rango_stock: "1_3"
        });

        expect(error).toEqual(
            [
                "categoria: La 'categoria' debe ser una de las siguientes opciones: Bebidas, Lacteos, Snacks, Limpieza, Frutas, Granos",
                "proveedor: El 'proveedor' debe venir en formato texto",
                "estado_alerta: El 'estado_alerta' debe ser 'ACTIVA' o 'RESUELTA'",
                "rango_stock: El 'rango_stock' debe venir en formato texto 'minimo-maximo', ej: '1-3'"
            ]
        );
    });

    it("debe retornar un arreglo de errores - no se proporcionó un payload válido [UpdateAmountProductDto]", () => {

        const [error] = UpdateAmountProductDto.create({});

        expect(error).toEqual(
            [
                "id: El 'id' debe ser un numero",
                "motivo: El 'motivo' es requerido",
                "operacion: La 'operacion' debe ser 'entrada' o 'salida'",
                "cantidad: La 'cantidad' es requerida"
            ]
        );
    });

});