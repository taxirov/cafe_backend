import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { UserService } from "../services/user.service";
import { RoleService } from "../services/role.service";
import { RoomService } from "../services/room.service";
import { ProductService } from "../services/product.service";
import { ProductInOrderService } from '../services/productinorder.service';
import { Order, User } from '@prisma/client';

const orderService = new OrderService();
const userService = new UserService();
const roleService = new RoleService();
const roomService = new RoomService();
const productService = new ProductService()
const proInOrService = new ProductInOrderService()


export type ProductInOrder = {
  id: number,
  user: { id: number, name: string }
  order_id: number,
  product: { id: number, name: string, price: number, image: string | null },
  count: number,
  total_price: number,
  created_date: string,
  update_date: string
}

export type OrderResponse = {
  id: number,
  title: string,
  desc: string | null,
  user: { id: number, name: string } | null,
  room: { id: number, name: string } | null,
  products: ProductInOrder[],
  total_price: number | null,
  status: number,
  created_date: string,
  update_date: string
}

export class OrderController {
  // done
  async post(req: Request, res: Response) {
    try {
      const user_id = res.locals.payload.id;
      const { title, desc, room_id, created_date } = req.body;
      const user_exsist = await userService.findById(+user_id)
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found by user_id: " + user_id
        })
      } else {
        if (room_id === null) {
          // create order
          const order_created = await orderService.create({ title, desc, user_id, room_id, created_date });
          // create user object
          let user: { id: number, name: string } = { id: user_exsist.id, name: user_exsist.name }
          // create room object
          let room: { id: number, name: string } | null = null
          // create response order object
          let order: OrderResponse = {
            id: order_created.id,
            title: order_created.title,
            desc: order_created.desc,
            user, room, products: [],
            total_price: order_created.total_price,
            status: order_created.status,
            created_date: order_created.created_date,
            update_date: order_created.update_date.toString()
          }
          res.status(201).json({
            message: "Order success created",
            order
          });
          const room_exsist = await roomService.findById(+room_id)
        } else {
          const room_exsist = await roomService.findById(+room_id)
          if (!room_exsist) {
            res.status(404).json({
              message: "Room not found by room_id: " + room_id
            })
          } else if (room_exsist.booked === true) {
            res.status(409).json({
              message: "Room already booked, please select another room"
            })
          } else {
            // create order
            const order_created = await orderService.create({ title, desc, user_id, room_id, created_date });
            // create user object
            let user: { id: number, name: string } = { id: user_exsist.id, name: user_exsist.name }
            // update status room_exsist 
            const room_order = await roomService.updateBooked(room_exsist.id, true)
            // create room object
            let room: { id: number, name: string } | null = { id: room_order.id, name: room_order.name }
            // create response order object
            let order: OrderResponse = {
              id: order_created.id,
              title: order_created.title,
              desc: order_created.desc,
              user, room, products: [],
              total_price: 0,
              status: order_created.status,
              created_date: order_created.created_date,
              update_date: order_created.update_date.toString()
            }
            res.status(201).json({
              message: "Order success created",
              order
            });
          }
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating order' });
    }
  }
  // done
  async put(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, desc, user_id, room_id } = req.body;
      const order_exsist = await orderService.findById(+id)
      if (order_exsist) {
        const order_updated = await orderService.update(+id, { title, desc, user_id, room_id });
        const user_order = await userService.findById(+user_id)
        if (user_order !== null) {
          // create user object
          let user: { id: number, name: string } = { id: user_order.id, name: user_order.name }
          // create products array
          let products: ProductInOrder[] = []
          const productInOrders = await proInOrService.findByOrderId(order_updated.id)
          for (let i = 0; i < productInOrders.length; i++) {
            const user_pro = await userService.findById(productInOrders[i].user_id)
            const product_pro = await productService.findById(productInOrders[i].product_id)
            if (user_pro !== null && product_pro !== null) {
              let product: ProductInOrder = {
                id: productInOrders[i].id,
                user: { id: user_pro.id, name: user_pro.name },
                order_id: productInOrders[i].order_id,
                product: { id: product_pro.id, name: product_pro.name, price: product_pro.price, image: product_pro.image },
                count: productInOrders[i].count,
                total_price: productInOrders[i].count * product_pro.price,
                created_date: productInOrders[i].created_date,
                update_date: productInOrders[i].update_date.toString()
              }
              products.push(product)
            }
          }
          // create room object
          let room: { id: number, name: string } | null
          if (room_id === null) {
            room = null
            let order: OrderResponse = {
              id: order_updated.id,
              title: order_updated.title,
              desc: order_updated.desc,
              user, room, products: [],
              total_price: order_updated.total_price,
              status: order_updated.status,
              created_date: order_updated.created_date,
              update_date: order_updated.update_date.toString()
            }
            res.status(201).json({ message: "Order success updated", order })
          } else {
            const room_order = await roomService.findById(+room_id)
            if (room_order) {
              room = { id: room_order.id, name: room_order.name }
              // create response order object
              let order: OrderResponse = {
                id: order_updated.id,
                title: order_updated.title,
                desc: order_updated.desc,
                user, room: room, products,
                total_price: order_updated.total_price,
                status: order_updated.status,
                created_date: order_updated.created_date,
                update_date: order_updated.update_date.toString()
              }
              res.status(201).json({
                message: "Order success updated",
                order
              });
            }
          }
        }
      }
      else { res.status(404).json({ message: 'Order not found' }) }
    } catch (error) {
      res.status(500).json({ message: 'Error updating order' });
    }
  }
  // done
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order_exsist = await orderService.findById(+id)
      if (order_exsist) {
        const order_deleted = await orderService.delete(+id);
        const user_order = await userService.findById(order_deleted.user_id);
        if (user_order !== null) {
          // create user object
          let user: { id: number, name: string } = { id: user_order.id, name: user_order.name }
          // create products array
          let products: ProductInOrder[] = []
          const productInOrders = await proInOrService.findByOrderId(order_deleted.id)
          for (let i = 0; i < productInOrders.length; i++) {
            const user_pro = await userService.findById(productInOrders[i].user_id)
            const product_pro = await productService.findById(productInOrders[i].product_id)
            if (user_pro !== null && product_pro !== null) {
              let product: ProductInOrder = {
                id: productInOrders[i].id,
                user: { id: user_pro.id, name: user_pro.name },
                order_id: productInOrders[i].order_id,
                product: { id: product_pro.id, name: product_pro.name, price: product_pro.price, image: product_pro.image },
                count: productInOrders[i].count,
                total_price: productInOrders[i].count * product_pro.price,
                created_date: productInOrders[i].created_date,
                update_date: productInOrders[i].update_date.toString()
              }
              products.push(product)
            }
          }
          // create room object
          let room: { id: number, name: string } | null
          if (order_deleted.room_id === null) {
            room = null
            let order: OrderResponse = {
              id: order_deleted.id,
              title: order_deleted.title,
              desc: order_deleted.desc,
              user, room, products: [],
              total_price: order_deleted.total_price,
              status: order_deleted.status,
              created_date: order_deleted.created_date,
              update_date: order_deleted.update_date.toString()
            }
            res.status(201).json({ message: "Order success deleted", order })
          } else {
            const room_order = await roomService.findById(order_deleted.room_id)
            if (room_order) {
              room = { id: room_order.id, name: room_order.name }
              // create response order object
              let order: OrderResponse = {
                id: order_deleted.id,
                title: order_deleted.title,
                desc: order_deleted.desc,
                user, room: room, products,
                total_price: order_deleted.total_price,
                status: order_deleted.status,
                created_date: order_deleted.created_date,
                update_date: order_deleted.update_date.toString()
              }
              const room_free = await roomService.updateBooked(room.id, false)
              res.status(201).json({ message: "Order success deleted", order });
            }
          }
        }
      }
      else { res.status(404).json({ message: 'Order not found' }) }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order' });
    }
  }
  // done
  async get(req: Request, res: Response) {
    try {
      const user_id = res.locals.payload.id
      const { status_order, room_id } = req.query;
      const user_exsist = await userService.findById(+user_id)
      if (user_exsist) {
        const user_role = await roleService.findById(user_exsist.role_id);
        if (user_role !== null && user_role.name === 'admin') {
          async function findAdminOrders(orders: Order[]) {
            let admin_orders: OrderResponse[] = []
            for (let i = 1; i < orders.length; i++) {
              // create user object
              let user: { id: number, name: string } | null = await userService.findCustomById(orders[i].user_id)
              // create room object
              let room: { id: number, name: string } | null = await roomService.findCustomById(orders[i].room_id)
              // create products list
              let products: ProductInOrder[] = []
              const productInOrders = await proInOrService.findByOrderId(orders[i].id)
              for (let i = 0; i < productInOrders.length; i++) {
                const user_pro = await userService.findById(productInOrders[i].user_id)
                const product_pro = await productService.findById(productInOrders[i].product_id)
                if (user_pro !== null && product_pro !== null) {
                  let product: ProductInOrder = {
                    id: productInOrders[i].id,
                    user: { id: user_pro.id, name: user_pro.name },
                    order_id: productInOrders[i].order_id,
                    product: { id: product_pro.id, name: product_pro.name, price: product_pro.price, image: product_pro.image },
                    count: productInOrders[i].count,
                    total_price: productInOrders[i].count * product_pro.price,
                    created_date: productInOrders[i].created_date,
                    update_date: productInOrders[i].update_date.toString()
                  }
                  products.push(product)
                }
              }
              let order: OrderResponse = {
                id: orders[i].id,
                title: orders[i].title,
                desc: orders[i].desc,
                user, room, products: [],
                total_price: orders[i].total_price,
                status: orders[i].status,
                created_date: orders[i].created_date,
                update_date: orders[i].update_date.toString()
              }
              admin_orders.push(order)
            } return admin_orders
          }
          // admin orders with status_order
          if (status_order !== undefined && status_order !== '') {
            const ordersAdmSta = await orderService.findByStatus(+status_order)
            if (room_id !== undefined && room_id !== '') {
              const ordersAdmStaRoom = await orderService.findByStatusRoom(+status_order, +room_id)
              let orders: OrderResponse[] = await findAdminOrders(ordersAdmStaRoom)
              res.status(200).json({
                message: "Orders by room_id: " + room_id + " and status_order: " + status_order,
                orders
              })
            } else {
              let orders: OrderResponse[] = await findAdminOrders(ordersAdmSta)
              res.status(200).json({
                message: "Orders by status_order: " + status_order,
                orders
              })
            }
          }
          // admin orders with room_id
          else if (room_id !== undefined && room_id !== '') {
            const ordersAdmRoom = await orderService.findByRoom(+room_id)
            let orders: OrderResponse[] = await findAdminOrders(ordersAdmRoom)
            res.status(200).json({
              message: "Orders by room_id: " + room_id,
              orders
            })
          }
          // admin orders
          else {
            const ordersAdm = await orderService.findAll()
            let orders: OrderResponse[] = await findAdminOrders(ordersAdm)
            res.status(200).json({
              message: "All orders",
              orders
            })
          }
        } else if (user_role !== null && user_role.name === "waiter") {
          async function findWaiterOrders(orders: Order[]) {
            let waiter_orders: OrderResponse[] = []
            for (let i = 1; i < orders.length; i++) {
              // create user object
              let user: { id: number, name: string } | null = await userService.findCustomById(orders[i].user_id)
              // create room object
              let room: { id: number, name: string } | null = await roomService.findCustomById(orders[i].room_id)
              // create products list
              let products: ProductInOrder[] = []
              const productInOrders = await proInOrService.findByOrderId(orders[i].id)
              for (let i = 0; i < productInOrders.length; i++) {
                const user_pro = await userService.findById(productInOrders[i].user_id)
                const product_pro = await productService.findById(productInOrders[i].product_id)
                if (user_pro !== null && product_pro !== null) {
                  let product: ProductInOrder = {
                    id: productInOrders[i].id,
                    user: { id: user_pro.id, name: user_pro.name },
                    order_id: productInOrders[i].order_id,
                    product: { id: product_pro.id, name: product_pro.name, price: product_pro.price, image: product_pro.image },
                    count: productInOrders[i].count,
                    total_price: productInOrders[i].count * product_pro.price,
                    created_date: productInOrders[i].created_date,
                    update_date: productInOrders[i].update_date.toString()
                  }
                  products.push(product)
                }
              }
              let order: OrderResponse = {
                id: orders[i].id,
                title: orders[i].title,
                desc: orders[i].desc,
                user, room, products: [],
                total_price: orders[i].total_price,
                status: orders[i].status,
                created_date: orders[i].created_date,
                update_date: orders[i].update_date.toString()
              }
              waiter_orders.push(order)
            }
            return waiter_orders
          }
          // waiter orders with status_order
          if (status_order !== undefined && status_order !== '') {
            const ordersWaiSta = await orderService.findByUserStatus(user_exsist.id, +status_order)
            if (room_id !== undefined && room_id !== '') {
              const ordersWaiStaRoom = await orderService.findByUserStatusRoom(user_exsist.id, +status_order, +room_id)
              let orders: OrderResponse[] = await findWaiterOrders(ordersWaiStaRoom)
              res.status(200).json({
                message: "Orders by room_id: " + room_id + " and status_order: " + status_order,
                orders
              })
            } else {
              let orders: OrderResponse[] = await findWaiterOrders(ordersWaiSta)
              res.status(200).json({
                message: "Orders by status_order: " + status_order,
                orders
              })
            }
          }
          // waiter orders with room_id
          else if (room_id !== undefined && room_id !== '') {
            const ordersWaiRoom = await orderService.findByUserRoom(user_exsist.id, +room_id)
            let orders: OrderResponse[] = await findWaiterOrders(ordersWaiRoom)
            res.status(200).json({
              message: "Orders by room_id: " + room_id,
              orders
            })
          }
          // waiter orders
          else {
            const ordersWai = await orderService.findByUser(user_exsist.id)
            let orders: OrderResponse[] = await findWaiterOrders(ordersWai)
            res.status(200).json({
              message: user_exsist.name + " orders",
              orders
            })
          }
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Error getting orders", error })
    }
  }
  // done
  async patchStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body
      const order_exsist = await orderService.findById(+id)
      if (!order_exsist) {
        res.status(404).json({
          message: "Order not found by id: " + id
        })
      } else {
        const order_updated = await orderService.updateStatus(+id, +status);
        const user_order = await userService.findById(order_updated.user_id);
        if (user_order !== null) {
          // create user object
          let user: { id: number, name: string } = { id: user_order.id, name: user_order.name }
          // create products array
          let products: ProductInOrder[] = []
          const productInOrders = await proInOrService.findByOrderId(order_updated.id)
          for (let i = 0; i < productInOrders.length; i++) {
            const user_pro = await userService.findById(productInOrders[i].user_id)
            const product_pro = await productService.findById(productInOrders[i].product_id)
            if (user_pro !== null && product_pro !== null) {
              let product: ProductInOrder = {
                id: productInOrders[i].id,
                user: { id: user_pro.id, name: user_pro.name },
                order_id: productInOrders[i].order_id,
                product: { id: product_pro.id, name: product_pro.name, price: product_pro.price, image: product_pro.image },
                count: productInOrders[i].count,
                total_price: productInOrders[i].count * product_pro.price,
                created_date: productInOrders[i].created_date,
                update_date: productInOrders[i].update_date.toString()
              }
              products.push(product)
            }
          }
          // create room object
          let room: { id: number, name: string } | null = await roomService.findCustomById(order_updated.room_id)
          let order: OrderResponse = {
            id: order_updated.id,
            title: order_updated.title,
            desc: order_updated.desc,
            user, room, products,
            total_price: order_updated.total_price,
            status: order_updated.status,
            created_date: order_updated.created_date,
            update_date: order_updated.update_date.toString()
          }
          if (room) {
            await roomService.updateBooked(room.id, false)
          }
          res.status(200).json({
            message: "Order status success updated",
            order
          })
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Error patching status"
      })
    }
  }
}
