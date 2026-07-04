import type { UpdateAmountProductDto } from "../../dtos/products/update-amount-prodcut.dto.ts";
import type { ProductEntity } from "../../entities/product.entity.ts";
import type { ProductRepository } from "../../repositories/product.repository.ts";

export interface UpdateAmountProductUseCase {
    execute( dto: UpdateAmountProductDto ): Promise<ProductEntity>
}

export class UpdateAmountProduct implements UpdateAmountProductUseCase {

    constructor(
        private readonly repository: ProductRepository
    ){}

    execute(dto: UpdateAmountProductDto): Promise<ProductEntity> {
        return this.repository.updateAmountById(dto);
    }

}