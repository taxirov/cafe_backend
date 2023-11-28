import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';

const roomService = new RoomService();

export class RoomController {
  // done
  async post(req: Request, res: Response) {
    try {
      const { name, desc, capacity, created_date } = req.body;
      const room_exsist = await roomService.findByName(name)
      if (room_exsist) {
        res.status(403).json({
          message: "Room already exsist by name: " + name,
          room: room_exsist
        })
      } else {
        const room = await roomService.create({ name, desc, capacity, created_date });
        res.status(201).json({
          message: "Room success created",
          room
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating room' });
    }
  }
  // done
  async put(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, desc, capacity } = req.body;
      const room_exsist = await roomService.findById(+id)
      if (room_exsist) {
        const room = await roomService.update(+id, { name, desc, capacity });
        res.status(200).json({
          message: "Room success updated",
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
    try {
      const { id } = req.params;
      const room_exsist = await roomService.findById(+id)
      if (!room_exsist) {
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
      const { booked } = req.query;
      if (booked !== undefined && booked !== '') {
        if (+booked === 0) {
          const rooms = await roomService.findByBooked(false)
          res.status(200).json({
            message: "Rooms by booked: false",
            rooms
          })
        } else {
          const rooms = await roomService.findByBooked(true)
          res.status(200).json({
            message: "Rooms by booked: true",
            rooms
          })
        }
      } else {
        const rooms = await roomService.findAll()
        res.status(200).json({
          message: "All rooms",
          rooms
        })
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching room' });
    }
  }
  // done
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
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
  // done
  async patchBooked(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { booked } = req.body;
      const room_exsist = await roomService.findById(+id)
      if (!room_exsist) {
        res.status(404).json({
          message: "Room not found by id: " + id
        })
      } else {
        const room = await roomService.updateBooked(+id, booked)
        res.status(200).json({
          message: "Room booked succes updated",
          room
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating room booked"
      })
    }
  }
}
