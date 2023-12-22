import { Prisma } from "@prisma/client";
import prisma from "../database"
import { PrInOrServiceModel } from "../models/productinoder.model";

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

export class ProductInOrderService {
    async create(dto: PrInOrServiceModel) {
        return await prisma.productInOrder.create({
            data: {
                user_id: dto.user_id,
                order_id: dto.order_id,
                product_id: dto.product_id,
                count: dto.count
            },
            select: productInOrderSelect
        })
    }
    async update(id: number, product_id: number, count: number) {
        return await prisma.productInOrder.update({ where: { id }, data: { product_id, count }, select: productInOrderSelect})
    }
    async delete(id: number) {
        return await prisma.productInOrder.delete({ where: { id }, select: productInOrderSelect})
    }
    async findAll(){
        return await prisma.productInOrder.findMany()
    }
    async findById(id: number){
        return await prisma.productInOrder.findUnique({ where: { id }})
    }
    async findByUserId(user_id: number){
        return await prisma.productInOrder.findMany({ where: { user_id }})
    }
    async findByOrderId(order_id: number){
        return await prisma.productInOrder.findMany({ where: { order_id }})
    }
    async findByOrderProduct(order_id: number, product_id: number){
        return await prisma.productInOrder.findMany({ where: { order_id, product_id }})
    }
    async findByProductId(product_id: number){
        return await prisma.productInOrder.findMany({ where: { product_id }})
    }
    async updateStatus(id: number, status: number) {
        return await prisma.productInOrder.update({ where: { id }, data: { status }, select: productInOrderSelect })
    }
    async findCustomByStatus(status: number) {
        return await prisma.productInOrder.findMany({ where: { status }, select: productInOrderSelect})
    }
    async updateTotalPrice(id: number, total_price: number) {
        return await prisma.productInOrder.update({ where: { id }, data: { total_price }, select: productInOrderSelect})
    }
    async findCustomByOrderId(order_id: number) {
        return await prisma.productInOrder.findMany({
            where: { order_id },
            select: productInOrderSelect
        })
    }
}