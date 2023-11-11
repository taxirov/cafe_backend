import prisma from "../database";
import { ProductServiceModel } from "../models/product.model";

export class ProductService {
    update(productId: number, arg1: { name: any; price: any; category_id: any; desc: any; image: any; }) {
      throw new Error('Method not implemented.');
    }
    async create(dto: ProductServiceModel) {
        return await prisma.product.create({
            data: {
                name: dto.name,
                price: dto.price,
                category_id: dto.category_id,
                desc: dto.desc,
                image: dto.name
            }
        })
    }
    async delete(id: number) {
        return await prisma.product.delete({ where: { id } })
    }
    async findMany() {
        return await prisma.product.findMany()
    }
    async findById(id: number) {
        return await prisma.product.findUnique({ where: { id }})
    }
    async findByCategoryId(category_id: number) {
        return await prisma.product.findMany({ where: { category_id }})
    }

}