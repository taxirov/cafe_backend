import { Prisma } from "@prisma/client";
import prisma from "../database";

const bookSelect: Prisma.BookSelect = {
    id: true,
    room: {
        select: {
            id: true,
            name: true,
            capacity: true
        }
    },
    user: {
        select: {
            id: true,
            name: true,
            role_id: true
        }
    },
    price: true,
    person: true,
    booker_name: true,
    booked_date: true,
    status: true,
    create_date: true
}

export class BookService {
    async create(room_id: number, user_id: number, price: number, person: number, booker_name: string, booked_date: string) {
        return await prisma.book.create({ data: { room_id, user_id, price, person, booker_name, booked_date }, select: bookSelect })
    }
    async update(id: number, room_id: number, user_id: number, price: number, person: number, booker_name: string, booked_date: string) {
        return await prisma.book.update({ where: { id }, data: { room_id, user_id, price, person, booker_name, booked_date }, select: bookSelect })
    }
    async delete(id: number) {
        return await prisma.book.delete({ where: { id }, select: bookSelect})
    }
    async updateStatus(id: number, status: number) {
        return await prisma.book.update({ where: { id }, data: { status }, select: bookSelect })
    }
    async findById(id: number) {
        return await prisma.book.findUnique({ where: { id }, select: bookSelect})
    }
    async findByBookedDate(booked_date: string) {
        return await prisma.book.findUnique({ where: { booked_date }, select: bookSelect})
    }
    async findMany() {
        return await prisma.book.findMany({ select: bookSelect, orderBy: { booked_date: 'desc'} })
    }
    async findManyCount() {
        return (await prisma.book.findMany({ select: { id: true } })).length
    }
    async findByStatus(status: number) {
        return await prisma.book.findMany({ where: { status }, select: bookSelect, orderBy: { booked_date: 'desc' } })
    }
    async findStatusCount(status: number) {
        return (await prisma.book.findMany({ select: { id: true } })).length
    }
}