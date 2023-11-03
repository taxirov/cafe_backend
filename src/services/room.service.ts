import prisma from "../database";
import { RoomServiceModel } from "../models/room.model";

export class RoomService {
    public create(dto: RoomServiceModel){
        return prisma.room.create({
            data: {
                name: dto.name,
                desc: dto.desc,
                capacity: dto.capacity,
                booked: dto.booked
            }
        })
    }
    public delete(id: number) {
        return prisma.room.delete({
            where: { id }
        })
    }
}