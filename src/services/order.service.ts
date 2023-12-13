import prisma from "../database";
import { OrderCreateModel, OrderUpdateModel } from "../models/order.model";
import { Prisma } from "@prisma/client";

const roomSelect: Prisma.RoomSelect = {
    id: true,
    name: true
}
const userSelect: Prisma.UserSelect = {
    id: true,
    name: true
}
const productSelect: Prisma.ProductSelect = {
    id: true,
    name: true,
    price: true,
    image: true,
    category_id: true
}
const productInOrderSelect: Prisma.ProductInOrderSelect = {
    id: true,
    user: { select: userSelect },
    order_id: true,
    product: { select: productSelect },
    count: true,
    total_price: true,
    status: true,
    create_date: true,
    update_date: true
}
const orderSelect: Prisma.OrderSelect = {
    id: true,
    title: true,
    desc: true,
    user: { select: userSelect },
    room: { select: roomSelect },
    total_price: true,
    status: true,
    create_date: true,
    update_date: true
}

export class OrderService {
    async create(dto: OrderCreateModel) {
        return await prisma.order.create({
            data: {
                title: dto.title,
                desc: dto.desc,
                user_id: dto.user_id,
                room_id: dto.room_id
            }
        })
    }
    async update(id: number, dto: OrderUpdateModel) {
        return await prisma.order.update({
            where: { id },
            data: {
                title: dto.title,
                desc: dto.desc,
                room_id: dto.room_id,
                user_id: dto.user_id
            }
        })
    }
    async delete(id: number) {
        return await prisma.order.delete({ where: { id } })
    }
    async findAll() {
        return await prisma.order.findMany()
    }
    async findAllByPagination(page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ skip, take })
    }
    async findById(id: number) {
        return await prisma.order.findUnique({ where: { id } })
    }
    async findByUser(user_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ where: { user_id }, skip, take })
    }
    async findByRoom(room_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ where: { room_id }, skip, take })
    }
    async findByUserStatus(user_id: number, status: number) {
        return await prisma.order.findMany({ where: { user_id, status } })
    }
    async findByUserStatusPagination(user_id: number, status: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ where: { user_id, status }, skip, take })
    }
    async findByStatus(status: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ where: { status }, skip, take })
    }
    async findByStatusRoom(status: number, room_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ where: { status, room_id }, skip, take })
    }
    async findByUserRoom(user_id: number, room_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ where: { user_id, room_id }, skip, take })
    }
    async findByUserStatusRoom(user_id: number, status: number, room_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ where: { user_id, status, room_id }, skip, take })
    }
    async updateStatus(id: number, status: number) {
        return await prisma.order.update({ where: { id }, data: { status } })
    }
    async updateTotal(id: number, total_price: number) {
        return await prisma.order.update({ where: { id }, data: { total_price } })
    }
    async findAllOrders() {
        return await prisma.order.findMany({
            select: orderSelect
        })
    }
}