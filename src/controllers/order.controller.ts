import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { UserService } from "../services/user.service";
import { RoleService } from "../services/role.service";
import { RoomService } from "../services/room.service";

const orderService = new OrderService();
const userService = new UserService();
const roleService = new RoleService();
const roomService = new RoomService();

export class OrderController {
  async post(req: Request, res: Response) {
    const user_id = res.locals.payload.id
    const { title, desc, room_id, total_price } = req.body;
    try {
      const user_exsist = await userService.findById(+user_id)
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found by user_id: " + user_id
        })
      } else {
        const room_exsist = await roomService.findById(+room_id)
        if (!room_exsist) {
          res.status(404).json({
            message: "Room not found by room_id: " + room_id
          })
        } else {
          const order = await orderService.create({ title, desc, user_id, room_id, total_price });
          res.status(201).json({
            message: "Order success created",
            order
          });
        }
      }
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
      const order_exsist = await orderService.findById(+id);
      if (order_exsist) {
        const order = await orderService.delete(+id);
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
      console.log(error)
      res.status(500).json({ error: 'Error fetching order' });
    }
  }

  async get(req: Request, res: Response) {
    const user = res.locals.payload
    const { status_order, room_id } = req.query;
    try {
      const user_role = await roleService.findByName(user.role)
      if (user_role?.name === 'admin') {
        // admin orders with status_order
        if (status_order !== undefined && status_order !== '') {
          const ordersAdmSta = await orderService.findByStatus(+status_order)
          if (room_id !== undefined && room_id !== '') {
            const ordersAdmStaRoom = await orderService.findByStatusRoom(+status_order, +room_id)
            res.status(200).json({
              message: "Orders by room_id: " + room_id + " and status_order: " + status_order,
              orders: ordersAdmStaRoom
            })
          } else {
            res.status(200).json({
              message: "Orders by status_order: " + status_order,
              orders: ordersAdmSta
            })
          }
        }
        // waiter orders with room_id
        else if (room_id !== undefined && room_id !== '') {
          const ordersAdmRoom = await orderService.findByRoomId(+room_id)
          res.status(200).json({
            message: "Orders by room_id: " + room_id,
            orders: ordersAdmRoom
          })
        }
        // waiter orders
        else {
          const ordersAdm = await orderService.findAll()
          res.status(200).json({
            message: "All orders",
            orders: ordersAdm
          })
        }
      } 
      else {
        // waiter orders with status_order
        if (status_order !== undefined && status_order !== '') {
          const ordersWaiSta = await orderService.findWaiterByStatus(user.id, +status_order)
          if (room_id !== undefined && room_id !== '') {
            const ordersWaiStaRoom = await orderService.findWaiterByStatusAndRoomId(user.id, +status_order,+room_id)
            res.status(200).json({
              message: "Orders by room_id: " + room_id + " and status_order: " + status_order,
              orders: ordersWaiStaRoom
            })
          } else {
            res.status(200).json({
              message: "Orders by status_order: " + status_order,
              orders: ordersWaiSta
            })
          }
        }
        // waiter orders with room_id
        else if (room_id !== undefined && room_id !== '') {
          const ordersWaiRoom = await orderService.findWaiterByRoomId(user.id, +room_id)
          res.status(200).json({
            message: "Orders by room_id: " + room_id,
            orders: ordersWaiRoom
          })
        }
        // waiter orders
        else {
          const ordersWai = await orderService.findByUserId(user.id)
          res.status(200).json({
            message: user.name + " orders",
            orders: ordersWai
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const user = res.locals.payload
      const orders = await orderService.findByUserId(+user.id)
      res.status(200).json({
        message: "User all orders",
        orders: orders.length
      })
    } catch(error) {
      console.log(error)
    }
  }

  async patchStatus(req: Request, res: Response) {
    const { id } = req.params
    const { status } = req.body
    try {
      const order_exsist = await orderService.findById(+id)
      if (!order_exsist) {
        res.status(404).json({
          message: "Order not found by id: " + id
        })
      } else {
        const order = await orderService.updateStatus(+id, +status)
        res.status(200).json({
          message: "Order status success updated",
          order
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error patching status"
      })
    }
  }

  async patchTotal(req: Request, res: Response) {
    const { id } = req.params
    const { total_price } = req.body
    try {
      const order_exsist = await orderService.findById(+id)
      if (!order_exsist) {
        res.status(404).json({
          message: "Order not found by id: " + id
        })
      } else {
        const order = await orderService.updateTotal(+id, total_price)
        res.status(200).json({
          message: "Order total price success updated",
          order
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error patching total price"
      })
    }
  }
}
