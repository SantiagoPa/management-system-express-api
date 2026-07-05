import type { CreateOrderDto } from "../dtos/order/create-order.dto.ts";
import type { UpdateStatusOrderDto } from "../dtos/order/update-status-order.dto.ts";
import type { OrderEntity } from "../entities/order.entity.ts";


export abstract class OrderDatasource {

    abstract create(createOrderDto: CreateOrderDto): Promise<OrderEntity>;
    abstract updateStatus(updateStatusOrderDto: UpdateStatusOrderDto): Promise<OrderEntity>;
}