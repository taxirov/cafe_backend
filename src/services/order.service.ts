import prisma from "../database";
import { OrderServiceModel } from "../models/order.model";

export class OrderService {
    async create(dto: OrderServiceModel) {
        return await prisma.order.create({
            data: {
                title: dto.title,
                desc: dto.desc,
                user_id: dto.user_id,
                room_id: dto.room_id,
                total_price: dto.total_price
            }
        })
    }
    async update(id: number, dto: OrderServiceModel) {
        return await prisma.order.update({
            where: { id },
            data: {
                title: dto.title,
                desc: dto.desc,
                user_id: dto.user_id,
                room_id: dto.room_id,
                total_price: dto.total_price
            }
        })
    }
    async delete(id: number) {
        return await prisma.order.delete({ where: { id }})
    }
    async findAll() {
        return await prisma.order.findMany()
    }
    async findById(id: number) {
        return await prisma.order.findUnique({ where: { id }})
    }
    async findByUserId(user_id: number) {
        return await prisma.order.findMany({ where: { user_id }})
    }
    async findByRoomId(room_id: number) {
        return await prisma.order.findMany({ where: { room_id }})
    }
    async findByStatus(status: boolean) {
        return await prisma.order.findMany({ where: { status }})
    }
    async updateStatus(id: number, status: boolean) {
        return await prisma.order.update({ where: { id }, data: { status }})
    }
}