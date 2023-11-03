import prisma from "../database";
import { ProductServiceModel } from "../models/product.model";

export class ProductService {
    public create(dto: ProductServiceModel) {
        return prisma.product.create({
            data: {
                name: dto.name,
                category_id: dto.category_id,
                desc: dto.desc
            }
        })
    }
    public delete(id: number) {
        return prisma.product.delete({
            where: { id }
        })
    }
}