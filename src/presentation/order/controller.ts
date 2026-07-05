import type { Request, Response } from "express";
import type { OrderRepository } from "../../domain/repositories/order.repository.ts";
import { CreateOrder, CreateOrderDto, UpdateStatusOrder, UpdateStatusOrderDto } from "../../domain/index.ts";

export class OrderController {

    constructor(
        private readonly repository: OrderRepository
    ) { }

    public createOrder = async (req: Request, res: Response) => {
        const [errors, createOrderDto] = CreateOrderDto.create(req.body);

        if (errors) {
            return res.status(400).json({
                data: null,
                success: false,
                errors,
            });
        }

        new CreateOrder(this.repository)
            .execute(createOrderDto!)
            .then((order) => res.json(order))
            .catch(error => res.status(400).json({error}))
    }

    public updateStatusOrder = async (req: Request, res: Response) => {
        const id = req.params.id;
        const [errors, updateStatusOrderDto] = UpdateStatusOrderDto.create({ ...req.body, id });

        if (errors) {
            return res.status(400).json({
                data: null,
                success: false,
                errors,
            });
        }

        new UpdateStatusOrder(this.repository)
            .execute(updateStatusOrderDto!)
            .then((order) => res.json(order))
            .catch(error => res.status(400).json({error}))
    }

}