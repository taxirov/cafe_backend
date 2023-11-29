import prisma from "../database";
import { RoomServiceModel } from "../models/room.model";

export class RoomService {
    // done
    async create(dto: RoomServiceModel) {
        return await prisma.room.create({
            data: {
                name: dto.name,
                desc: dto.desc,
                capacity: dto.capacity,
                created_date: dto.created_date
            }
        })
    }
    // done
    async update(id: number, dto: { name: string, desc: string, capacity: number }) {
        return await prisma.room.update({
            where: { id },
            data: { name: dto.name, desc: dto.desc, capacity: dto.capacity }
        })
    }
    // done
    async delete(id: number) {
        return await prisma.room.delete({ where: { id } })
    }
    // done
    async updateBooked(id: number, booked: boolean) {
        return await prisma.room.update({ where: { id }, data: { booked } })
    }
    // done
    async findByBooked(booked: boolean) {
        return await prisma.room.findMany({ where: { booked } })
    }
    // done
    async findAll() {
        return await prisma.room.findMany()
    }
    // done 
    async findById(id: number) {
        return await prisma.room.findUnique({ where: { id }})
    }
    // done
    async findCustomById(room_id: number | null) {
        if (room_id === null) {
            return null
        } else {
            return await prisma.room.findUnique({ where: { id: room_id }, select: { id: true, name: true} })
        }
    }
    // 
    async findByName(name: string) {
        return await prisma.room.findUnique({ where: { name } })
    }
}