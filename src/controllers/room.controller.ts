import { Request, Response } from 'express';
import RoomService from './room.service';

const roomService = new RoomService();

export class RoomController {
  async createRoom(req: Request, res: Response) {
    try {
      const { name, desc, capacity, booked } = req.body;
      const room = await roomService.createRoom({ name, desc, capacity, booked });
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: 'Error creating room' });
    }
  }

  async updateRoom(req: Request, res: Response) {
    const roomId = parseInt(req.params.id);
    const { name, desc, capacity, booked } = req.body;

    try {
      const room = await roomService.updateRoom(roomId, { name, desc, capacity, booked });
      if (room) {
        res.json(room);
      } else {
        res.status(404).json({ error: 'Room not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating room' });
    }
  }

  async deleteRoom(req: Request, res: Response) {
    const roomId = parseInt(req.params.id);

    try {
      const room = await roomService.deleteRoom(roomId);
      if (room) {
        res.json(room);
      } else {
        res.status(404).json({ error: 'Room not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting room' });
    }
  }

  async getRoom(req: Request, res: Response) {
    const roomId = parseInt(req.params.id);

    try {
      const room = await roomService.getRoom(roomId);
      if (room) {
        res.json(room);
      } else {
        res.status(404).json({ error: 'Room not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching room' });
    }
  }
}
