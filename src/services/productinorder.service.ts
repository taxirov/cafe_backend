import prisma from "../database"
import { PrInOrServiceModel } from "../models/productinoder.model";

export class ProductInOrderService {
    async create(dto: PrInOrServiceModel) {
        return await prisma.productInOrder.create({
            data: {
                user_id: dto.user_id,
                order_id: dto.order_id,
                product_id: dto.product_id,
                count: dto.count
            }
        })
    }
    async update(id: number, order_id: number, product_id: number, count: number) {
        return await prisma.productInOrder.update({ where: { id }, data: { order_id, product_id, count }})
    }
    async delete(id: number) {
        return await prisma.productInOrder.delete({ where: { id }})
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
        return await prisma.productInOrder.update({ where: { id }, data: { status }})
    }
    async updateTotalPrice(id: number, total_price: number) {
        return await prisma.productInOrder.update({ where: { id }, data: { total_price }})
    }
}