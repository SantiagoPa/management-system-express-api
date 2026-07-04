import type { ProductEntity } from "../../entities/product.entity.ts";
import type { ProductRepository } from "../../repositories/product.repository.ts";

export interface GetProductUseCase {
    execute( id: number ): Promise<ProductEntity>
}

export class GetProduct implements GetProductUseCase {

    constructor(
        private readonly repository: ProductRepository
    ){}

    execute(id: number): Promise<ProductEntity> {
        return this.repository.findById(id)
    }

}