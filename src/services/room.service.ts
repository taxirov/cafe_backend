import prisma from "../database";
import { RoomServiceModel } from "../models/room.model";

export class RoomService {
    async create(dto: RoomServiceModel){
        return await prisma.room.create({
            data: {
                name: dto.name,
                desc: dto.desc,
                capacity: dto.capacity,
                booked: dto.booked,
                image: dto.image
            }
        })
    }
    async update(id: number, dto: RoomServiceModel){
        return await prisma.room.update({
            where: { id },
            data: {
                name: dto.name,
                desc: dto.desc,
                capacity: dto.capacity,
                booked: dto.booked,
                image: dto.image
            }
        })
    }
    async delete(id: number) {
        return await prisma.room.delete({ where: { id }})
    }
    async updateBooked(id: number, booked: boolean) {
        return await prisma.room.update({ where: { id }, data: { booked }})
    }
    async findAll() {
        return await prisma.room.findMany()
    }
    async findById(id: number) {
        return await prisma.room.findUnique({ where: { id }})
    }
    async findByName(name: string) {
        return await prisma.room.findUnique({ where: { name }})
    }
}