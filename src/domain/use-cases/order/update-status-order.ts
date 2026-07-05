import type { UpdateStatusOrderDto } from "../../dtos/order/update-status-order.dto.ts";
import type { OrderEntity } from "../../entities/order.entity.ts";
import type { OrderRepository } from "../../repositories/order.repository.ts";

export interface CreateOrderStatusUseCase {
    execute(dto: UpdateStatusOrderDto): Promise<OrderEntity>
}

export class UpdateStatusOrder implements CreateOrderStatusUseCase {

    constructor(
        private readonly repository: OrderRepository
    ) { }

    execute(dto: UpdateStatusOrderDto): Promise<OrderEntity> {
        return this.repository.updateStatus(dto);
    }

}