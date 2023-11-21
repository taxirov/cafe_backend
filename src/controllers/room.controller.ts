import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';

const roomService = new RoomService();

export class RoomController {
  // done
  async post(req: Request, res: Response) {
    try {
      const { name, desc, capacity, booked, image } = req.body;
      const room_exsist = await roomService.findByName(name)
      if(room_exsist) {
        res.status(403).json({
          message: "Room already exsist by name: " + name,
          room: room_exsist
        })
      } else {
        const room = await roomService.create({ name, desc, capacity, booked, image });
        res.status(201).json({
          message: "Room succes created",
          room
        });}
    } catch (error) {
      res.status(500).json({ message: 'Error creating room' });
    }
  }

  // done
  async put(req: Request, res: Response) {
    const { id } = req.params;
    const { name, desc, capacity, booked, image } = req.body;
    try {
      const room = await roomService.update(+id, { name, desc, capacity, booked, image });
      if(room) {
        res.status(200).json({
          message: "Room succes updated",
          room
        });
      } else {
        res.status(404).json({ message: 'Room not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating room' });
    }
  }

  // done
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const room_exsist = await roomService.findById(+id)
      if(!room_exsist) {
        res.status(404).json({ message: 'Room not found' });
      } else {
        const room = await roomService.delete(+id);
        res.status(200).json({
          message: "Room success deleted",
          room
        }); 
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting room' });
    }
  }

  // done
  async get(req: Request, res: Response) {
    try {
      const rooms = await roomService.findAll()
      res.status(200).json({
        message: "All rooms",
        rooms
      })
    } catch (error) {
      res.status(500).json({ message: 'Error fetching room' });
    }
  }

  // done
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const room = await roomService.findById(+id);
      if (room) {
        res.status(200).json({
          message: "Room by id: " + id,
          room
        });
      } else {
        res.status(404).json({ message: 'Room not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching room' });
    }
  }
}
