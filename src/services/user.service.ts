import prisma from "../database";
import { UserServiceModel } from "../models/user.model";

export class UserService {
    // done
    async create(dto: UserServiceModel) {
        return await prisma.user.create({
            data: {
                name: dto.name,
                username: dto.username,
                password: dto.password,
                salary: dto.salary,
                phone: dto.phone,
                role_id: dto.role_id,
                email: dto.email,
                joined_date: dto.joined_date
            }
        })
    }
    // done
    async findAll() {
        return await prisma.user.findMany()
    }
    // done
    async findById(id: number) {
        return await prisma.user.findUnique({ where: { id } })
    }
    // done
    async findByUsername(username: string) {
        return await prisma.user.findUnique({ where: { username }})
    }
    // done
    async updateRole(id: number, role_id: number) {
        return await prisma.user.update({ data: { role_id }, where: { id }})
    }
    // done
    async createImage(id: number, image: string) {
        return await prisma.user.update({ data: { image }, where: { id }})
    }
    // done
    async updateUsername(id: number, username: string) {
        return await prisma.user.update({ where: { id }, data: { username }})
    }
    // done
    async updatePassword(id: number, password: string) {
        return await prisma.user.update({ where: { id }, data: { password }})
    }
    // done
    async updateData(id: number, name: string, username: string, phone: string, salary: number, email: string, role_id: number) {
        return await prisma.user.update({
            where: { id },
            data: { name, username, phone, salary, email, role_id }
        })
    }
    // done
    async delete(id: number) {
        return await prisma.user.delete({ where: { id }})
    }

}