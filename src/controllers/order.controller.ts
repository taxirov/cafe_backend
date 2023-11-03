import { Request, Response } from 'express';
import OrderService from './order.service';

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { title, desc, worker_id, room_id, total_price } = req.body;
      const order = await orderService.createOrder({ title, desc, worker_id, room_id, total_price });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error creating order' });
    }
  }

  async updateOrder(req: Request, res: Response) {
    const orderId = parseInt(req.params.id);
    const { title, desc, worker_id, room_id, total_price } = req.body;

    try {
      const order = await orderService.updateOrder(orderId, { title, desc, worker_id, room_id, total_price });
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating order' });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    const orderId = parseInt(req.params.id);

    try {
      const order = await orderService.deleteOrder(orderId);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting order' });
    }
  }

  async getOrder(req: Request, res: Response) {
    const orderId = parseInt(req.params.id);

    try {
      const order = await orderService.getOrder(orderId);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching order' });
    }
  }
}

export default new OrderController();
