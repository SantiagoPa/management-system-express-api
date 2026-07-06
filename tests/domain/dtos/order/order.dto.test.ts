import { CreateOrderDto, UpdateStatusOrderDto } from "../../../../src/domain/index.ts";

describe("Dtos domain/dtos/order testing", () => {

    it("debe retornar un arreglo de errores - no se proporcionó un payload válido [CreateOrderDto]", () => {

        const [error] = CreateOrderDto.create({});

        expect(error).toEqual(
            [
                "producto_id: El 'producto_id' debe ser numerico",
                "cantidad_solicitada: La 'cantidad_solicitada' es requerido",
            ]
        );
    });

    it("debe retornar un arreglo de errores - cantidad_solicitada debe ser mayor a 0 [CreateOrderDto]", () => {

        const [error] = CreateOrderDto.create({ producto_id: 1, cantidad_solicitada: -5 });

        expect(error).toEqual(
            [
                "cantidad_solicitada: Debe ser mayor a 0",
            ]
        );
    });

    it("debe retornar un error indefinido y una instancia de CreateOrderDto - se proporciona un payload válido [CreateOrderDto]", () => {

        const [error, dto] = CreateOrderDto.create({ producto_id: 1, cantidad_solicitada: 10 });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateOrderDto);
        expect(dto?.producto_id).toBe(1);
        expect(dto?.cantidad_solicitada).toBe(10);
    });


    it("debe retornar un arreglo de errores - no se proporcionó un payload válido [UpdateStatusOrderDto]", () => {

        const [error] = UpdateStatusOrderDto.create({});

        expect(error).toEqual(
            [
                "id: El 'id' debe ser texto",
                "type_action: El 'type_action' debe ser 'aprobar', 'rechazar' o 'recibir'",
            ]
        );
    });

    it("debe retornar un arreglo de errores - type_action tiene un valor inválido [UpdateStatusOrderDto]", () => {

        const [error] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "cancelar" });

        expect(error).toEqual(
            [
                "type_action: El 'type_action' debe ser 'aprobar', 'rechazar' o 'recibir'",
            ]
        );
    });

    it("debe retornar un arreglo de errores - motivo es requerido cuando type_action es rechazar [UpdateStatusOrderDto]", () => {

        const [error] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "rechazar" });

        expect(error).toEqual(
            [
                "motivo: El 'motivo' es requerido cuando se rechaza",
            ]
        );
    });

    it("debe retornar un arreglo de errores - motivo debe tener al menos 10 caracteres cuando type_action es rechazar [UpdateStatusOrderDto]", () => {

        const [error] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "rechazar", motivo: "corto" });

        expect(error).toEqual(
            [
                "motivo: Minimo deben ser 10 caracteres",
            ]
        );
    });

    it("debe retornar un error indefinido y una instancia de UpdateStatusOrderDto - se aprueba la orden sin motivo [UpdateStatusOrderDto]", () => {

        const [error, dto] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "aprobar" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateStatusOrderDto);
        expect(dto?.id).toBe("abc-123");
        expect(dto?.type_action).toBe("aprobar");
        expect(dto?.motivo).toBeUndefined();
    });

    it("debe retornar un error indefinido y una instancia de UpdateStatusOrderDto - se rechaza la orden con un motivo válido [UpdateStatusOrderDto]", () => {

        const [error, dto] = UpdateStatusOrderDto.create({
            id: "abc-123",
            type_action: "rechazar",
            motivo: "El producto no cumple con los requisitos de calidad"
        });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateStatusOrderDto);
        expect(dto?.type_action).toBe("rechazar");
        expect(dto?.motivo).toBe("El producto no cumple con los requisitos de calidad");
    });

    it("debe retornar un error indefinido y una instancia de UpdateStatusOrderDto - se recibe la orden sin motivo [UpdateStatusOrderDto]", () => {

        const [error, dto] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "recibir" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateStatusOrderDto);
        expect(dto?.type_action).toBe("recibir");
    });

});