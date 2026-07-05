import type { CreateOrderDto } from "../../dtos/order/create-order.dto.ts";
import type { OrderEntity } from "../../entities/order.entity.ts";
import type { OrderRepository } from "../../repositories/order.repository.ts";

export interface CreateOrderUseCase {
    execute(dto: CreateOrderDto): Promise<OrderEntity>
}

export class CreateOrder implements CreateOrderUseCase {

    constructor(
        private readonly repository: OrderRepository
    ) { }

    execute(dto: CreateOrderDto): Promise<OrderEntity> {
        return this.repository.create(dto);
    }

}