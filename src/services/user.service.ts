import prisma from "../database";
import { UserServiceModel } from "../models/user.model";
import { Role } from "@prisma/client";

export class UserService {
    public async create(dto: UserServiceModel) {
        return await prisma.user.create({
            data: {
                name: dto.name,
                username: dto.username,
                password: dto.password,
                salary: dto.salary,
                phone: dto.phone,
                role: dto.role as Role
            }
        })
    }
    public async findAll() {
        return await prisma.user.findMany()
    }
    public async findById(id: number) {
        return await prisma.user.findUnique({
            where: { id }
        })
    }
    public async findByUsername(username: string) {
        return await prisma.user.findUnique({
            where: { username }
        })
    }
    public async changeRole(id: number, role: Role) {
        return await prisma.user.update({
            where: { id }, 
            data: { role }
        })
    }
    public async changeUsername(id: number, username: string) {
        return await prisma.user.update({
            where: { id },
            data: { username }
        })
    }
    public async changeName(id: number, name: string) {
        return await prisma.user.update({
            where: { id },
            data: { name }
        })
    }
}