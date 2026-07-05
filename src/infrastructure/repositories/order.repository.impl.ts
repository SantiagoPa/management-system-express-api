import type { OrderEntity } from "../../domain/entities/order.entity.ts";
import type { CreateOrderDto, OrderDatasource, UpdateStatusOrderDto } from "../../domain/index.ts";
import type { OrderRepository } from "../../domain/repositories/order.repository.ts";

export class OrderRepositoryImpl implements OrderRepository {

    constructor(
        private readonly datasource: OrderDatasource
    ){}

    create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        return this.datasource.create(createOrderDto);
    }
    updateStatus(updateStatusOrderDto: UpdateStatusOrderDto): Promise<OrderEntity> {
        return this.datasource.updateStatus(updateStatusOrderDto)
    }

}