import prisma from "../database";
import { UserServiceModel } from "../models/user.model";

export class UserService {
    async create(dto: UserServiceModel) {
        return await prisma.user.create({
            data: {
                name: dto.name,
                username: dto.username,
                password: dto.password,
                salary: dto.salary,
                phone: dto.phone,
                role_id: dto.role_id,
                email: dto.email
            }
        })
    }
    async findAll() {
        return await prisma.user.findMany()
    }
    async findById(id: number) {
        return await prisma.user.findUnique({ where: { id } })
    }
    async findByRoleId(role_id: number) {
        return await prisma.user.findMany({ where: { role_id } })
    }
    async findCustomById(id: number) {
        return await prisma.user.findUnique({ where: { id }, select: { id: true, name: true} })
    }
    async findByUsername(username: string) {
        return await prisma.user.findUnique({ where: { username }})
    }
    async updateRole(id: number, role_id: number) {
        return await prisma.user.update({ data: { role_id }, where: { id }})
    }
    async createImage(id: number, image: string) {
        return await prisma.user.update({ data: { image }, where: { id }})
    }
    async updateUsername(id: number, username: string) {
        return await prisma.user.update({ where: { id }, data: { username }})
    }
    async updatePassword(id: number, password: string) {
        return await prisma.user.update({ where: { id }, data: { password }})
    }
    async updateData(id: number, name: string, username: string, phone: string, salary: number, email: string, role_id: number, status: number) {
        return await prisma.user.update({
            where: { id },
            data: { name, username, phone, salary, email, role_id, status }
        })
    }
    async delete(id: number) {
        return await prisma.user.delete({ where: { id }})
    }

}