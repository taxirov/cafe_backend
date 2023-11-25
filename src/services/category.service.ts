import { CategoryServiceModel } from "../models/category.model";
import prisma from "../database";

export class CategoryService {
    // done
    async create(dto: CategoryServiceModel) {
        return await prisma.category.create({
            data: {
                name: dto.name,
                desc: dto.desc,
                created_date: dto.created_date
            }
        })
    }
    // done
    async findAll(){
        return await prisma.category.findMany()
    }
    // done
    async findById(id: number) {
        return prisma.category.findUnique({ where: { id }})
    }
    // done
    async findByName(name: string) {
        return prisma.category.findUnique({ where: { name }})
    }
    // done
    async delete(id: number) {
        return await prisma.category.delete({ where: { id }})
    }
    // done
    async createImage(id: number, image: string) {
        return await prisma.category.update({ data: { image }, where: { id }})
    }
    // done
    async update(id: number, name: string, desc: string) {
        return await prisma.category.update({
            where: { id }, data: { name, desc }
        })
    }
}