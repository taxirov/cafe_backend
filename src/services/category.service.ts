import { CategoryServiceModel } from "../models/category.model";
import prisma from "../database";

export class CategoryService {
    async create(dto: CategoryServiceModel) {
        return await prisma.category.create({
            data: {
                name: dto.name,
                desc: dto.desc
            }
        })
    }
    async findAll(){
        return await prisma.category.findMany()
    }
    async findById(id: number) {
        return prisma.category.findUnique({ where: { id }})
    }
    async findByName(name: string) {
        return prisma.category.findUnique({ where: { name }})
    }
    async delete(id: number) {
        return await prisma.category.delete({ where: { id }})
    }
    async createImage(id: number, image: string) {
        return await prisma.category.update({ data: { image }, where: { id }})
    }
    async update(id: number, name: string, desc: string) {
        return await prisma.category.update({
            where: { id }, data: { name, desc }
        })
    }
}