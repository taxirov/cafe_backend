import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export class OrderController {
  async post(req: Request, res: Response) {
    try {
      const { title, desc, user_id, room_id, total_price } = req.body;
      const order = await orderService.create({ title, desc, user_id, room_id, total_price });
      res.status(201).json({
        message: "Order success created",
        order
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating order' });
    }
  }

  async put(req: Request, res: Response) {
    const { id } = req.params;
    const { title, desc, user_id, room_id, total_price } = req.body;
    try {
      const order = await orderService.update(+id, { title, desc, user_id, room_id, total_price });
      if (order) {
        res.status(201).json({
          message: "Order success updated",
          order
        });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating order' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const order = await orderService.delete(+id);
      if (order) {
        res.status(201).json({
          message: "Order success deleted",
          order
        });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order' });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const order = await orderService.findById(+id);
      if (order) {
        res.status(201).json({
          message: "Order by id: " + id,
          order
        });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching order' });
    }
  }

  async get(req: Request, res: Response) {
    const { user_id, status_order, room_id } = req.query;
    try {
      // user_id
      if(user_id !== undefined && user_id !== ''){
        const orders = await orderService.findByUserId(+user_id)
        res.status(200).json({
          message: "Orders by user_id: " + user_id,
          orders
        })
      } 
      // status_order
      else if(status_order !== undefined && status_order !== ''){
        const orders = await orderService.findByStatus(Boolean(status_order))
        res.status(200).json({
          message: "Orders by status_order: " + status_order,
          orders
        })
      } 
      // room_id
      else if(room_id !== undefined && room_id !== ''){
        const orders = await orderService.findByRoomId(+room_id)
        res.status(200).json({
          message: "Orders by room_id: " + room_id,
          orders
        })
      } 
      // user_id and status_order and room_id
      else if(user_id !== undefined && status_order !== undefined && room_id !== undefined && user_id !== '' && status_order !== '' && room_id !== ''){
        const orders_by_room = await orderService.findByRoomId(+room_id)
        const orders_by_status = await orderService.findByStatus(Boolean(status_order))
        const orders_by_user = await orderService.findByUserId(+user_id)
        const orders = orders_by_user.concat(orders_by_room).concat(orders_by_status)
        res.status(200).json({
          message: "Orders by room_id: " + room_id + " and by user_id: " + user_id + " and status_order: " + status_order,
          orders
        })
      } 
      // all orders
      else if(user_id === undefined && status_order === undefined && room_id === undefined && user_id === '' && status_order === '' && room_id === ''){
        const orders = await orderService.findAll()
        res.status(200).json({
          message: "All orders",
          orders
        })
      } 
      // user_id and status_order
      else if(user_id !== undefined && user_id !== '' && status_order !== undefined && status_order !== '') {
        const orders_by_status = await orderService.findByStatus(Boolean(status_order))
        const orders_by_user = await orderService.findByUserId(+user_id)
        const orders = orders_by_user.concat(orders_by_status)
        res.status(200).json({
          message: "Orders by user_id: " + user_id + " and status_order: " + status_order,
          orders
        })
      } 
      // user_id and room_id
      else if(user_id !== undefined && user_id !== '' && room_id !== undefined && room_id !== '') {
        const orders_by_room = await orderService.findByRoomId(+room_id)
        const orders_by_user = await orderService.findByUserId(+user_id)
        const orders = orders_by_user.concat(orders_by_room)
        res.status(200).json({
          message: "Orders by user_id: " + user_id + " and room_id: " + room_id,
          orders
        })
      }
      // status_order and room_id
      else if(status_order !== undefined && status_order !== '' && room_id !== undefined && room_id !== '') {
        const orders_by_room = await orderService.findByRoomId(+room_id)
        const orders_by_status = await orderService.findByStatus(Boolean(status_order))
        const orders = orders_by_room.concat(orders_by_status)
        res.status(200).json({
          message: "Orders by room_id: " + room_id + " and status_order: " + status_order,
          orders
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching order' });
    }
  }
}
