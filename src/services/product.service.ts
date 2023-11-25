import prisma from "../database";
import { ProductServiceModel } from "../models/product.model";

export class ProductService {
    // done
    async update(dto: {id: number, name: string, price: number, category_id: number, desc: string }) {
      return await prisma.product.update({
        where: { id: dto.id }, data: { name: dto.name, price: dto.price, category_id: +dto.category_id, desc: dto.desc }
      })
    }
    // done
    async create(dto: ProductServiceModel) {
        return await prisma.product.create({
            data: {
                name: dto.name,
                price: dto.price,
                category_id: dto.category_id,
                desc: dto.desc,
                created_date: dto.created_date,
            }
        })
    }
    // done
    async delete(id: number) {
        return await prisma.product.delete({ where: { id } })
    }
    // done
    async findMany() {
        return await prisma.product.findMany()
    }
    // done
    async findById(id: number) {
        return await prisma.product.findUnique({ where: { id }})
    }
    // done
    async findByName(name: string) {
        return await prisma.product.findUnique({ where: { name }})
    }
    // done
    async findByCategoryId(category_id: number) {
        return await prisma.product.findMany({ where: { category_id }})
    }
    // done
    async createImage(dto: {id: number, image: string}) {
        return await prisma.product.update({
            where: { id: dto.id }, data: { image: dto.image }
        })
    }
}