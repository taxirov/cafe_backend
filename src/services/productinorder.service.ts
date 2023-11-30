import prisma from "../database"
import { PrInOrServiceModel } from "../models/productinoder.model";

export class ProductInOrderService {
    // done
    async create(dto: PrInOrServiceModel) {
        return await prisma.productInOrder.create({
            data: {
                user_id: dto.user_id,
                order_id: dto.order_id,
                product_id: dto.product_id,
                count: dto.count,
                created_date: dto.created_date
            }
        })
    }
    // done
    async update(id: number, order_id: number, product_id: number, count: number) {
        return await prisma.productInOrder.update({ where: { id }, data: { order_id, product_id, count }})
    }
    // done
    async delete(id: number) {
        return await prisma.productInOrder.delete({ where: { id }})
    }
    // done
    async findAll(){
        return await prisma.productInOrder.findMany()
    }
    // done
    async findById(id: number){
        return await prisma.productInOrder.findUnique({ where: { id }})
    }
    // done
    async findByUserId(user_id: number){
        return await prisma.productInOrder.findMany({ where: { user_id }})
    }
    // done
    async findByOrderId(order_id: number){
        return await prisma.productInOrder.findMany({ where: { order_id }})
    }
    // done
    async findByOrderProduct(order_id: number, product_id: number){
        return await prisma.productInOrder.findMany({ where: { order_id, product_id }})
    }
    // done
    async findByProductId(product_id: number){
        return await prisma.productInOrder.findMany({ where: { product_id }})
    }
    // done
    async updateStatus(id: number, status: number) {
        return await prisma.productInOrder.update({ where: { id }, data: { status }})
    }
    // done
    async updateTotalPrice(id: number, total_price: number) {
        return await prisma.productInOrder.update({ where: { id }, data: { total_price }})
    }
}