import prisma from "../database";
import { RoleServiceModel } from "../models/role.model";

export class RoleService {
    async create(name: string) {
        return await prisma.role.create({ data: { name }})
    }
    async findAll() {
        return await prisma.role.findMany()
    }
    async findById(id: number) {
        return await prisma.role.findUnique({ where: { id } })
    }
    async findByName(name: string) {
        return await prisma.role.findUnique({ where: { name }})
    }
    async updateName(id: number, name: string) {
        return await prisma.role.update({ data: { name }, where: { id }})
    }
    async delete(id: number) {
        return await prisma.role.delete({ where: { id }})
    }
}