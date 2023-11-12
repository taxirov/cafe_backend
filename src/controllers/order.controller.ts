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
      // with user_id
      if (user_id !== undefined && user_id !== '') {
        // find by user_id
        const orders_by_user = await orderService.findByUserId(+user_id)
        // continue status_order
        if (status_order !== undefined && status_order !== '') {
          // find by status
          const orders_by_status = await orderService.findByStatus(Boolean(status_order))
          // continue room_id
          if (room_id !== undefined && room_id !== '') {
            // find by room_id
            const orders_by_room = await orderService.findByRoomId(+room_id)
            // order by user_id, room_id and status_order
            const orders = orders_by_user.concat(orders_by_room).concat(orders_by_status)
            return res.status(200).json({
              message: "Orders by user_id: " + user_id + " and room_id: " + room_id +  " and status_order: " + status_order,
              orders
            })
          } else {
            // orders by user_id and status_order
            const orders = orders_by_user.concat(orders_by_status)
            res.status(200).json({
              message: "Orders by user_id: " + user_id + " and status_order: " + status_order,
              orders
            })
          }
        } else {
          if (room_id !== undefined && room_id !== '') {
            // find by room_id
            const orders_by_room = await orderService.findByRoomId(+room_id)
            // order by user_id and room_id
            const orders = orders_by_user.concat(orders_by_room)
            return res.status(200).json({
              message: "Orders by user_id: " + user_id + " and room_id: " + room_id,
              orders
            })
          } else {
            // orders by user
            const orders = orders_by_user
            res.status(200).json({
              message: "Orders by user_id: " + user_id,
              orders
            })
          }
        }
      }
      // with status_order
      else if (status_order !== undefined && status_order !== '') {
        const orders_by_status = await orderService.findByStatus(Boolean(status_order))
        if (room_id !== undefined && room_id !== '') {
          const orders_by_room = await orderService.findByRoomId(+room_id)
          const orders = orders_by_status.concat(orders_by_room)
          return res.status(200).json({
            message: "Orders by room_id: " + room_id + " and status_order: " + status_order,
            orders
          })
        } else {
          res.status(200).json({
            message: "Orders by status_order: " + status_order,
            orders: orders_by_status
          })
        }
      }
      // with room_id
      else if (room_id !== undefined && room_id !== '') {
        const orders_by_room = await orderService.findByRoomId(+room_id)
        res.status(200).json({
          message: "Orders by room_id: " + room_id,
          orders: orders_by_room
        })
      } 
      else {
        const orders = await orderService.findAll()
        res.status(200).json({
          message: "All orders",
          orders
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching order' });
    }
  }

  async patchStatus(req: Request, res: Response) {
    const { id } = req.params
    const { status } = req.body
    try {
      const order_exsist = await orderService.findById(+id)
      if(!order_exsist) {
        res.status(404).json({
          message: "Order not found by id: " + id
        })
      } else {
        const order = await orderService.updateStatus(+id, status)
        res.status(200).json({
          message: "Order status success updated",
          order
        })
      }
    } catch(error) {
      res.status(500).json({
        message: "Error patching status"
      })
    }
    }
}
