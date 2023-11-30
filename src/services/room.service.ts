import prisma from "../database";
import { RoomServiceModel } from "../models/room.model";

export class RoomService {
    async create(dto: RoomServiceModel) {
        return await prisma.room.create({
            data: {
                name: dto.name,
                desc: dto.desc,
                capacity: dto.capacity
            }
        })
    }
    async update(id: number, dto: { name: string, desc: string, capacity: number }) {
        return await prisma.room.update({
            where: { id },
            data: { name: dto.name, desc: dto.desc, capacity: dto.capacity }
        })
    }
    async delete(id: number) {
        return await prisma.room.delete({ where: { id } })
    }
    async updateBooked(id: number, booked: boolean) {
        return await prisma.room.update({ where: { id }, data: { booked } })
    }
    async findByBooked(booked: boolean) {
        return await prisma.room.findMany({ where: { booked } })
    }
    async findAll() {
        return await prisma.room.findMany()
    }
    async findById(id: number) {
        return await prisma.room.findUnique({ where: { id }})
    }
    async findCustomById(room_id: number | null) {
        if (room_id === null) {
            return null
        } else {
            return await prisma.room.findUnique({ where: { id: room_id }, select: { id: true, name: true} })
        }
    }
    async findByName(name: string) {
        return await prisma.room.findUnique({ where: { name } })
    }
}