import type { FilterProductDto } from "../../domain/dtos/products/filter-product.dto.ts";
import type { UpdateAmountProductDto } from "../../domain/dtos/products/update-amount-prodcut.dto.ts";
import type { ProductExtendedEntity } from "../../domain/entities/product-extended.entity.ts";
import type { CreateProductDto, ProductDatasource, ProductEntity, ProductRepository } from "../../domain/index.ts";

export class ProductRepositoryImpl implements ProductRepository {

    constructor(
        private readonly datasource: ProductDatasource
    ) { }


    seed(): Promise<string> {
        return this.datasource.seed();
    }

    create(createProductDto: CreateProductDto): Promise<ProductEntity> {
        return this.datasource.create(createProductDto);
    }

    getAll(filterProductDto: FilterProductDto): Promise<ProductEntity[]> {
        return this.datasource.getAll(filterProductDto);
    }

    findById(id: number): Promise<ProductExtendedEntity> {
        return this.datasource.findById(id);
    }

    updateAmountById(updateAmountProductDto: UpdateAmountProductDto): Promise<ProductEntity> {
        return this.datasource.updateAmountById(updateAmountProductDto);
    }

    deleteById(id: number): Promise<ProductEntity> {
        return this.datasource.deleteById(id);
    }

}