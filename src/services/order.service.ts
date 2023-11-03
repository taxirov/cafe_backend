import prisma from "../database";
import { OrderServiceModel } from "../models/order.model";

export class OrderService {
    public create(dto: OrderServiceModel) {
        return prisma.order.create({
            data: {
                title: dto.title,
                desc: dto.desc,
                worker_id: dto.worker_id,
                room_id: dto.room_id
            }
        })
    }
    public delete(id: number) {
        return prisma.order.delete({
            where: { id }
        })
    }
}