import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { UserService } from "../services/user.service";
import { RoleService } from "../services/role.service";
import { RoomService } from "../services/room.service";
import { ProductService } from "../services/product.service";
import { ProductInOrderService } from '../services/productinorder.service';
import { Order, User } from '@prisma/client';
import { Payload } from './user.controller';

const orderService = new OrderService();
const userService = new UserService();
const roleService = new RoleService();
const roomService = new RoomService();
const productService = new ProductService()
const proInOrService = new ProductInOrderService()

type UserCustom = {
  id: number,
  name: string,
  role?: {
    id: number,
    name: string,
    create_date: Date,
    update_date: Date
  }
};

type ProductCustom = {
  id: number,
  name: string,
  price: number,
  image: string | null,
  category_id: number
};

type RoomCustom = {
  id: number,
  name: string
}

export type ProductInOrderResponse = {
  id: number,
  user?: UserCustom,
  order_id: number,
  product: ProductCustom,
  count: number,
  total_price: number,
  status: number,
  create_date: Date,
  update_date: Date
}

export type OrderResponse = {
  id: number,
  title: string,
  desc: string | null,
  user?: UserCustom,
  room?: RoomCustom | null,
  products: ProductInOrderResponse[],
  total_price: number | null,
  status: number,
  create_date: Date,
  update_date: Date
}

export type OrderWithoutProduct = {
  id: number,
  title: string,
  desc: string | null,
  user?: UserCustom,
  room?: RoomCustom | null,
  total_price: number | null,
  status: number,
  create_date: Date,
  update_date: Date
}


export class OrderController {
  async post(req: Request, res: Response) {
    try {
      const user_id = res.locals.payload.id;
      const { title, desc, room_id } = req.body;
      const user_exsist = await userService.findById(+user_id)
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found by user_id: " + user_id
        })
      } else {
        if (room_id === null) {
          // create order
          const order_created = await orderService.create({ title, desc, user_id, room_id });
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
            create_date: order_created.create_date,
            update_date: order_created.update_date
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
            const order_created = await orderService.create({ title, desc, user_id, room_id });
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
              create_date: order_created.create_date,
              update_date: order_created.update_date
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
          let products: ProductInOrderResponse[] = []
          const productInOrders = await proInOrService.findByOrderId(order_updated.id)
          for (let i = 0; i < productInOrders.length; i++) {
            const user_pro = await userService.findById(productInOrders[i].user_id)
            const product_pro = await productService.findById(productInOrders[i].product_id)
            if (user_pro !== null && product_pro !== null) {
              let product: ProductInOrderResponse = {
                id: productInOrders[i].id,
                user: { id: user_pro.id, name: user_pro.name },
                order_id: productInOrders[i].order_id,
                product: { id: product_pro.id, name: product_pro.name, price: product_pro.price, image: product_pro.image, category_id: product_pro.category_id },
                count: productInOrders[i].count,
                total_price: productInOrders[i].count * product_pro.price,
                create_date: productInOrders[i].create_date,
                update_date: productInOrders[i].update_date,
                status: productInOrders[i].status
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
              create_date: order_updated.create_date,
              update_date: order_updated.update_date
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
                create_date: order_updated.create_date,
                update_date: order_updated.update_date
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
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order_exsist = await orderService.findById(+id)
      if (order_exsist) {
        const order_deleted = await orderService.delete(+id);
        let products = await proInOrService.findCustomByOrderId(order_deleted.id)
        let order = {
          id: order_deleted.id,
          title: order_deleted.title,
          desc: order_deleted.desc,
          user: order_deleted.user,
          room: order_deleted.room,
          products,
          total_price: order_deleted.total_price,
          status: order_deleted.status,
          create_date: order_deleted.create_date,
          update_date: order_deleted.update_date
        }
        if (order.room != null) {
          await roomService.updateBooked(order.room.id, false)
          res.status(200).json({
            message: "Order success deleted",
            order
          });
        } else {
          res.status(200).json({
            message: "Order success deleted",
            order
          });
        }
      } else {
        res.status(404).json({ message: 'Order not found' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order' });
    }
  }
  async get(req: Request, res: Response) {
    try {
      const user: Payload = res.locals.payload
      const { status_order, room_id, user_id, current_page, per_page } = req.query
      const user_exsist = await userService.findCustomById(user.id)
      if (user_exsist) {
        if (user_exsist.role.name === 'admin') {
          async function takeOrders(orders: OrderWithoutProduct[]) {
            let orders_res: OrderResponse[] = []
            for (let i = 0; i < orders.length; i++) {
              let products = await proInOrService.findCustomByOrderId(orders[i].id)
              let order: OrderResponse = {
                id: orders[i].id,
                title: orders[i].title,
                desc: orders[i].desc,
                user: orders[i].user,
                room: orders[i].room,
                products,
                total_price: orders[i].total_price,
                status: orders[i].status,
                create_date: orders[i].create_date,
                update_date: orders[i].update_date
              }
              orders_res.push(order)
            } return orders_res
          }
          const default_current_page = 1
          const default_per_page = 12
          const max_per_page = 96
          let total_order_count = 0
          let total_page_count: number = 1
          if (total_order_count > default_per_page) {
            total_page_count = Math.floor(total_order_count / default_per_page)
            if (total_order_count % default_per_page > 0) {
              total_page_count += 1
            }
          }
          if (per_page !== undefined && current_page !== undefined && per_page !== '' && current_page !== '') {
            // orders by status_order, room_id and user_id
            if (status_order !== undefined && status_order !== '') {
              if (room_id !== undefined && room_id !== '') {
                if (user_id !== undefined && user_id !== '') {
                  if (+per_page > 96) {
                    let orders_status_room_user: OrderWithoutProduct[] = (await orderService.findByUserStatusRoomPagination(+user_id, +status_order, +room_id, +current_page, max_per_page))
                    let orders: OrderResponse[] = await takeOrders(orders_status_room_user)
                    total_order_count = (await orderService.findByUserStatusRoomCount(+user_id, +status_order, +room_id))
                    if (total_order_count > +per_page) {
                      total_page_count = Math.floor(total_order_count / +per_page)
                      if (total_order_count % (+per_page) > 0) {
                        total_page_count += 1
                      }
                    }
                    res.status(200).json({
                      message: "Orders with all queries. !Max per_page = 96",
                      orders,
                      status_order: +status_order,
                      room_id: +room_id,
                      user_id: +user_id,
                      current_page: +current_page,
                      per_page: +per_page,
                      total_page_count,
                      total_order_count
                    })
                  } else {
                    let orders_status_room_user: OrderWithoutProduct[] = (await orderService.findByUserStatusRoomPagination(+user_id, +status_order, +room_id, +current_page, +per_page))
                    let orders: OrderResponse[] = await takeOrders(orders_status_room_user)
                    total_order_count = (await orderService.findByUserStatusRoomCount(+user_id, +status_order, +room_id))
                    if (total_order_count > +per_page) {
                      total_page_count = Math.floor(total_order_count / +per_page)
                      if (total_order_count % (+per_page) > 0) {
                        total_page_count += 1
                      }
                    }
                    res.status(200).json({
                      message: "Orders with all queries.",
                      orders,
                      status_order: +status_order,
                      room_id: +room_id,
                      user_id: +user_id,
                      current_page: +current_page,
                      per_page: +per_page,
                      total_page_count,
                      total_order_count
                    })
                  }

                } else {
                  if (+per_page > 96) {
                    const orders_status_room: OrderWithoutProduct[] = await orderService.findByStatusRoomPagination(+status_order, +room_id, +current_page, max_per_page)
                    let orders: OrderResponse[] = await takeOrders(orders_status_room)
                    total_order_count = await orderService.findByStatusRoomCount(+status_order, +room_id,)
                    if (total_order_count > +per_page) {
                      total_page_count = Math.floor(total_order_count / +per_page)
                      if (total_order_count % (+per_page) > 0) {
                        total_page_count += 1
                      }
                    }
                    res.status(200).json({
                      message: "Orders without user_id. !Max per_page = 96",
                      orders,
                      status_order: +status_order,
                      room_id: +room_id,
                      user_id: null,
                      current_page: +current_page,
                      per_page: +per_page,
                      total_page_count,
                      total_order_count
                    })
                  } else {
                    const orders_status_room: OrderWithoutProduct[] = await orderService.findByStatusRoomPagination(+status_order, +room_id, +current_page, +per_page)
                    let orders: OrderResponse[] = await takeOrders(orders_status_room)
                    total_order_count = await orderService.findByStatusRoomCount(+status_order, +room_id,)
                    if (total_order_count > +per_page) {
                      total_page_count = Math.floor(total_order_count / +per_page)
                      if (total_order_count % (+per_page) > 0) {
                        total_page_count += 1
                      }
                    }
                    res.status(200).json({
                      message: "Orders without user_id.",
                      orders,
                      status_order: +status_order,
                      room_id: +room_id,
                      user_id: null,
                      current_page: +current_page,
                      per_page: +per_page,
                      total_page_count,
                      total_order_count
                    })
                  }
                }
              } else {
                if (+per_page > 96) {
                  const orders_status = await orderService.findByStatusPagination(+status_order, +current_page, max_per_page)
                  let orders: OrderResponse[] = await takeOrders(orders_status)
                  total_order_count = await orderService.findByStatusCount(+status_order)
                  if (total_order_count > +per_page) {
                    total_page_count = Math.floor(total_order_count / +per_page)
                    if (total_order_count % (+per_page) > 0) {
                      total_page_count += 1
                    }
                  }
                  res.status(200).json({
                    message: "Orders without user_id. !Max per_page = 96",
                    orders,
                    status_order: +status_order,
                    room_id: null,
                    user_id: null,
                    current_page: +current_page,
                    per_page: +per_page,
                    total_page_count,
                    total_order_count
                  })
                } else {
                  const orders_status = await orderService.findByStatusPagination(+status_order, +current_page, +per_page)
                  let orders: OrderResponse[] = await takeOrders(orders_status)
                  total_order_count = await orderService.findByStatusCount(+status_order)
                  if (total_order_count > +per_page) {
                    total_page_count = Math.floor(total_order_count / +per_page)
                    if (total_order_count % (+per_page) > 0) {
                      total_page_count += 1
                    }
                  }
                  res.status(200).json({
                    message: "Orders without user_id and room_id",
                    orders,
                    status_order: +status_order,
                    room_id: null,
                    user_id: null,
                    current_page: +current_page,
                    per_page: +per_page,
                    total_page_count,
                    total_order_count
                  })
                }
              }
            }
            // orders by room_id and user_id
            else if (room_id !== undefined && room_id !== '') {
              if (user_id !== undefined && user_id !== '') {
                total_order_count = await orderService.findByUserRoomCount(+user_id, +room_id)
                if (total_order_count > +per_page) {
                  total_page_count = Math.floor(total_order_count / +per_page)
                  if (total_order_count % (+per_page) > 0) {
                    total_page_count += 1
                  }
                }
                if (+per_page > 96) {
                  let orders_room_user = await orderService.findByUserRoomPagination(+user_id, +room_id, +current_page, max_per_page)
                  let orders: OrderResponse[] = await takeOrders(orders_room_user)
                  res.status(200).json({
                    message: "Orders without status_order. !Max per_page = 96",
                    orders,
                    status_order: null,
                    room_id: +room_id,
                    user_id: +user_id,
                    current_page: +current_page,
                    per_page: +per_page,
                    total_page_count,
                    total_order_count
                  })
                } else {
                  let orders_room_user = await orderService.findByUserRoomPagination(+user_id, +room_id, +current_page, +per_page)
                  let orders: OrderResponse[] = await takeOrders(orders_room_user)
                  res.status(200).json({
                    message: "Orders without status_order.",
                    orders,
                    status_order: null,
                    room_id: +room_id,
                    user_id: +user_id,
                    current_page: +current_page,
                    per_page: +per_page,
                    total_page_count,
                    total_order_count
                  })
                }
              } else {
                total_order_count = await orderService.findByRoomCount(+room_id)
                if (total_order_count > +per_page) {
                  total_page_count = Math.floor(total_order_count / +per_page)
                  if (total_order_count % (+per_page) > 0) {
                    total_page_count += 1
                  }
                }
                if (+per_page > 96) {
                  const orders_room = await orderService.findByRoomPagination(+room_id, +current_page, max_per_page)
                  let orders: OrderResponse[] = await takeOrders(orders_room)
                  res.status(200).json({
                    message: "Orders without status_order and user_id. !Max per_page = 96",
                    orders,
                    status_order: null,
                    room_id: +room_id,
                    user_id: null,
                    current_page: +current_page,
                    per_page: +per_page,
                    total_page_count,
                    total_order_count
                  })
                } else {
                  const orders_room = await orderService.findByRoomPagination(+room_id, +current_page, +per_page)
                  let orders: OrderResponse[] = await takeOrders(orders_room)
                  res.status(200).json({
                    message: "Orders without status_order and user_id",
                    orders,
                    status_order: null,
                    room_id: +room_id,
                    user_id: null,
                    current_page: +current_page,
                    per_page: +per_page,
                    total_page_count,
                    total_order_count
                  })
                }
              }
            }
            // orders by user_id
            else if (user_id !== undefined && user_id !== '') {
              total_order_count = await orderService.findByUserCount(+user_id)
              if (total_order_count > +per_page) {
                total_page_count = Math.floor(total_order_count / +per_page)
                if (total_order_count % (+per_page) > 0) {
                  total_page_count += 1
                }
              }
              if (+per_page > 96) {
                let orders_user = await orderService.findByUserPagination(+user_id, +current_page, max_per_page)
                let orders: OrderResponse[] = await takeOrders(orders_user)
                res.status(200).json({
                  message: "Orders by user_id. !Max per_page = 96",
                  orders,
                  status_order: null,
                  room_id: null,
                  user_id: +user_id,
                  current_page: +current_page,
                  per_page: +per_page,
                  total_page_count,
                  total_order_count
                })
              } else {
                let orders_user = await orderService.findByUserPagination(+user_id, +current_page, +per_page)
                let orders: OrderResponse[] = await takeOrders(orders_user)
                res.status(200).json({
                  message: "Orders by user_id",
                  orders,
                  status_order: null,
                  room_id: null,
                  user_id: +user_id,
                  current_page: +current_page,
                  per_page: +per_page,
                  total_page_count,
                  total_order_count
                })
              }
            }
            // orders by pagination to do
            else {
              total_order_count = await orderService.findAllCount()
              if (total_order_count > +per_page) {
                total_page_count = Math.floor(total_order_count / +per_page)
                if (total_order_count % (+per_page) > 0) {
                  total_page_count += 1
                }
              }
              if (+per_page > 96) {
                const orders_pag = await orderService.findAllPagination(+current_page, max_per_page)
                let orders: OrderResponse[] = await takeOrders(orders_pag)
                res.status(200).json({
                  message: 'All order with pagination. !Max per_page = 96',
                  orders,
                  status_order: null,
                  room_id: null,
                  user_id: null,
                  current_page: +current_page,
                  per_page: +per_page,
                  total_page_count,
                  total_order_count
                })
              } else {
                const orders_pag = await orderService.findAllPagination(+current_page, +per_page)
                let orders: OrderResponse[] = await takeOrders(orders_pag)
                res.status(200).json({
                  message: 'All order with pagination',
                  orders,
                  status_order: null,
                  room_id: null,
                  user_id: null,
                  current_page: +current_page,
                  per_page: +per_page,
                  total_page_count,
                  total_order_count
                })
              }
            }
          } else {
            const orders_default = await orderService.findAllPagination(default_current_page, default_per_page)
            let orders: OrderResponse[] = await takeOrders(orders_default)
            total_order_count = await orderService.findAllCount()
            if (total_order_count > default_per_page) {
              total_page_count = Math.floor(total_order_count / default_per_page)
              if (total_order_count % default_per_page > 0) {
                total_page_count += 1
              }
            }
            res.status(200).json({
              message: "All orders by default pagination",
              orders,
              status_order: null,
              room_id: null,
              user_id: null,
              current_page: default_current_page,
              per_page: default_per_page,
              total_page_count,
              total_order_count
            })
          }
        } else {
          res.status(403).json({ message: "You are not admin, this endpoint only admins" })
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Error getting orders", error })
    }
  }
  async getWaiter(req: Request, res: Response) {
    try {
      const user_id = +res.locals.payload.id
      const user_exsist = await userService.findById(user_id)
      if (user_exsist !== null) {
        const user_role = await roleService.findById(user_exsist.role_id)
        if (user_role !== null && user_role.name == 'waiter') {
          // add products order
          async function addProductsOrder(orders: OrderWithoutProduct[]) {
            const waiter_orders: OrderResponse[] = []
            for (let i = 0; i < orders.length; i++) {
              let order: OrderResponse = {
                id: orders[i].id,
                title: orders[i].title,
                desc: orders[i].desc,
                user: orders[i].user,
                room: orders[i].room,
                products: await proInOrService.findCustomByOrderId(orders[i].id),
                total_price: orders[i].total_price,
                status: orders[i].status,
                create_date: orders[i].create_date,
                update_date: orders[i].update_date
              }
              waiter_orders.push(order)
            }
            return waiter_orders
          }
          const orders_waiter = await orderService.findCustomByUserStatus(user_exsist.id, 1, 1, 100)
          let orders: OrderResponse[] = await addProductsOrder(orders_waiter)
          res.status(200).json({
            message: user_exsist.name + " orders",
            orders
          })
        } else {
          res.status(403).json({ message: "You are not waiter, this endpoint only waiters" })
        }
      } else {
        res.status(404).json({ message: "User not found" })
      }
    } catch (error) {
      res.status(500).json({ message: "Error getting orders", error })
    }
  }
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
          let products: ProductInOrderResponse[] = []
          const productInOrders = await proInOrService.findByOrderId(order_updated.id)
          for (let i = 0; i < productInOrders.length; i++) {
            const user_pro = await userService.findById(productInOrders[i].user_id)
            const product_pro = await productService.findById(productInOrders[i].product_id)
            if (user_pro !== null && product_pro !== null) {
              let product: ProductInOrderResponse = {
                id: productInOrders[i].id,
                user: { id: user_pro.id, name: user_pro.name },
                order_id: productInOrders[i].order_id,
                product: { id: product_pro.id, name: product_pro.name, price: product_pro.price, image: product_pro.image, category_id: product_pro.category_id },
                count: productInOrders[i].count,
                total_price: productInOrders[i].count * product_pro.price,
                create_date: productInOrders[i].create_date,
                update_date: productInOrders[i].update_date,
                status: productInOrders[i].status
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
            create_date: order_updated.create_date,
            update_date: order_updated.update_date
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
