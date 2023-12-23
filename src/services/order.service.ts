import prisma from "../database";
import { OrderCreateModel, OrderUpdateModel } from "../models/order.model";
import { Prisma } from "@prisma/client";

const roomSelect: Prisma.RoomSelect = {
    id: true,
    name: true
}
const userSelect: Prisma.UserSelect = {
    id: true,
    name: true,
    role: true
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
                room_id: dto.room_id,
                create_date: dto.create_date
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
        return await prisma.order.delete({ where: { id }, select: orderSelect })
    }
    async findAll() {
        return await prisma.order.findMany()
    }
    async findAllByStatus(status: number) {
        return await prisma.order.findMany({ 
            where: { status }, 
            select: orderSelect, 
            orderBy: { create_date: 'desc' } })
    }
    async findAllPagination(page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            skip, 
            take, 
            select: orderSelect, 
            orderBy: { create_date: 'desc' } })
    }
    async findAllCount() {
        return (await prisma.order.findMany({ select: { id: true } })).length
    }
    async findById(id: number) {
        return await prisma.order.findUnique({ where: { id } })
    }
    async findByUserPagination(user_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            where: { user_id }, 
            skip, 
            take, 
            select: orderSelect, 
            orderBy: { create_date: 'desc' } })
    }
    async findByUserCount(user_id: number) {
        return (await prisma.order.findMany({ where: { user_id }, select: { id: true } })).length
    }
    async findByRoomPagination(room_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            where: { room_id }, 
            skip, 
            take, 
            select: orderSelect,
            orderBy: { create_date: 'desc' }
         })
    }
    async findByRoomCount(room_id: number) {
        return (await prisma.order.findMany({ where: { room_id }, select: { id: true } })).length
    }
    async findCustomByUserStatus(user_id: number, status: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            where: { user_id, status }, 
            select: orderSelect, 
            skip, 
            take, 
            orderBy: { create_date: 'desc' }
        })
    }
    async findByUserStatusPagination(user_id: number, status: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            where: { user_id, status }, 
            skip, 
            take, 
            orderBy: { create_date: 'desc' } 
        })
    }
    async findByStatusPagination(status: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            where: { status }, 
            skip, take, 
            select: orderSelect, 
            orderBy: { create_date: 'desc' } })
    }
    async findByStatusCount(status: number) {
        return (await prisma.order.findMany({ where: { status }, select: { id: true } })).length
    }
    async findByStatusRoomPagination(status: number, room_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            where: { status, room_id }, 
            skip, 
            take, 
            select: orderSelect, 
            orderBy: { create_date: 'desc' } })
    }
    async findByStatusRoomCount(status: number, room_id: number) {
        return (await prisma.order.findMany({ where: { status, room_id }, select: { id: true } })).length
    }
    async findByUserRoomPagination(user_id: number, room_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            where: { user_id, room_id }, 
            skip, 
            take, 
            select: orderSelect, 
            orderBy: { create_date: 'desc' } })
    }
    async findByUserRoomCount(user_id: number, room_id: number) {
        return (await prisma.order.findMany({ where: { user_id, room_id }, select: { id: true } })).length
    }
    async findByUserStatusRoomCount(user_id: number, status: number, room_id: number) {
        return (await prisma.order.findMany({ where: { user_id, status, room_id } , select: { id: true} })).length
    }
    async findByUserStatusRoomPagination(user_id: number, status: number, room_id: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.order.findMany({ 
            where: { user_id, status, room_id }, 
            skip, 
            take, 
            select: orderSelect,
            orderBy: { create_date: 'desc' } })
    }
    async updateStatus(id: number, status: number) {
        return await prisma.order.update({ where: { id }, data: { status } })
    }
    async updateTotal(id: number, total_price: number) {
        return await prisma.order.update({ where: { id }, data: { total_price }, select: orderSelect })
    }
    async findAllOrders() {
        return await prisma.order.findMany({
            select: orderSelect,
            orderBy: { create_date: 'desc' }
        })
    }
    async findByYearMonthDay(day: string) {
        return await prisma.order.findMany({
            where: {
                create_date: {
                    startsWith: day
                }
            }, select: orderSelect
        })
    }
}