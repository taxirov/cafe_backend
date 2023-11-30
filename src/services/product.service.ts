import prisma from "../database";
import { ProductServiceModel } from "../models/product.model";

export class ProductService {
    async update(dto: {id: number, name: string, price: number, category_id: number, desc: string }) {
      return await prisma.product.update({
        where: { id: dto.id }, data: { name: dto.name, price: dto.price, category_id: +dto.category_id, desc: dto.desc }
      })
    }
    async create(dto: ProductServiceModel) {
        return await prisma.product.create({
            data: {
                name: dto.name,
                price: dto.price,
                category_id: dto.category_id,
                desc: dto.desc
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
    async findCustomById(id: number) {
        return await prisma.product.findUnique({ where: { id }, select: { id: true, name: true, price: true, image: true }})
    }
    async findByName(name: string) {
        return await prisma.product.findUnique({ where: { name }})
    }
    async findByCategoryId(category_id: number) {
        return await prisma.product.findMany({ where: { category_id }})
    }
    async createImage(dto: {id: number, image: string}) {
        return await prisma.product.update({
            where: { id: dto.id }, data: { image: dto.image }
        })
    }
}