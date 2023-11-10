import { CategoryServiceModel } from "../models/category.model";
import prisma from "../database";

export class CategoryService {
    public create(dto: CategoryServiceModel) {
        return prisma.category.create({
            data: {
                name: dto.name,
                desc: dto.desc,
                image: dto.name
            }
        })
    }
    public findAll(){
        return prisma.category.findMany()
    }
    public findById(id: number) {
        return prisma.category.findUnique({
            where: { id }
        })
    }
    public findByName(name: string) {
        return prisma.category.findUnique({
            where: { name }
        })
    }
    public delete(id: number) {
        return prisma.category.delete({
            where: { id }
        })
    }
}