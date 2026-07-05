import { CreateOrderDto, UpdateStatusOrderDto } from "../../../../src/domain/index.ts";


describe("Dtos domain/dtos/order testing", () => {


    it("should return array string error - does not provide the payload [CreateOrderDto]", () => {

        const [error] = CreateOrderDto.create({});

        expect(error).toEqual(
            [
                "producto_id: El 'producto_id' debe ser numerico",
                "cantidad_solicitada: La 'cantidad_solicitada' es requerido",
            ]
        );
    });

    it("should return array string error - cantidad_solicitada is not positive [CreateOrderDto]", () => {

        const [error] = CreateOrderDto.create({ producto_id: 1, cantidad_solicitada: -5 });

        expect(error).toEqual(
            [
                "cantidad_solicitada: Debe ser mayor a 0",
            ]
        );
    });

    it("should return undefined error and a CreateOrderDto instance - provides a valid payload [CreateOrderDto]", () => {

        const [error, dto] = CreateOrderDto.create({ producto_id: 1, cantidad_solicitada: 10 });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(CreateOrderDto);
        expect(dto?.producto_id).toBe(1);
        expect(dto?.cantidad_solicitada).toBe(10);
    });


    it("should return array string error - does not provide the payload [UpdateStatusOrderDto]", () => {

        const [error] = UpdateStatusOrderDto.create({});

        expect(error).toEqual(
            [
                "id: El 'id' debe ser texto",
                "type_action: El 'typeAction' debe ser 'aprobar', 'rechazar' o 'recibir'",
            ]
        );
    });

    it("should return array string error - type_action is invalid [UpdateStatusOrderDto]", () => {

        const [error] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "cancelar" });

        expect(error).toEqual(
            [
                "type_action: El 'typeAction' debe ser 'aprobar', 'rechazar' o 'recibir'",
            ]
        );
    });

    it("should return array string error - motivo is required when type_action is rechazar [UpdateStatusOrderDto]", () => {

        const [error] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "rechazar" });

        expect(error).toEqual(
            [
                "motivo: El 'motivo' es requerido cuando se rechaza",
            ]
        );
    });

    it("should return array string error - motivo is too short when type_action is rechazar [UpdateStatusOrderDto]", () => {

        const [error] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "rechazar", motivo: "corto" });

        expect(error).toEqual(
            [
                "motivo: Minimo deben ser 10 caracteres",
            ]
        );
    });

    it("should return undefined error and a UpdateStatusOrderDto instance - aprobar without motivo [UpdateStatusOrderDto]", () => {

        const [error, dto] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "aprobar" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateStatusOrderDto);
        expect(dto?.id).toBe("abc-123");
        expect(dto?.type_action).toBe("aprobar");
        expect(dto?.motivo).toBeUndefined();
    });

    it("should return undefined error and a UpdateStatusOrderDto instance - rechazar with valid motivo [UpdateStatusOrderDto]", () => {

        const [error, dto] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "rechazar", motivo: "El producto no cumple con los requisitos de calidad" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateStatusOrderDto);
        expect(dto?.type_action).toBe("rechazar");
        expect(dto?.motivo).toBe("El producto no cumple con los requisitos de calidad");
    });

    it("should return undefined error and a UpdateStatusOrderDto instance - recibir without motivo [UpdateStatusOrderDto]", () => {

        const [error, dto] = UpdateStatusOrderDto.create({ id: "abc-123", type_action: "recibir" });

        expect(error).toBeUndefined();
        expect(dto).toBeInstanceOf(UpdateStatusOrderDto);
        expect(dto?.type_action).toBe("recibir");
    });

});
