import prisma from "../database"
import { PrInOrServiceModel } from "../models/productinoder.model";

export class ProductInOrderService {
    public create(dto: PrInOrServiceModel) {
        return prisma.productInOrder.create({
            data: {
                user_id: dto.user_id,
                order_id: dto.order_id,
                product_id: dto.product_id
            }
        })
    }
    public delete(id: number) {
        return prisma.productInOrder.delete({
            where: { id }
        })
    }
    public findById(id: number){
        return prisma.productInOrder.findMany({
            where: { id }
        })
    }
    public findByUserId(user_id: number){
        return prisma.productInOrder.findMany({
            where: { user_id }
        })
    }
    public findByOrderId(order_id: number){
        return prisma.productInOrder.findMany({
            where: { order_id }
        })
    }
    public findByProductId(product_id: number){
        return prisma.productInOrder.findMany({
            where: { product_id }
        })
    }
}