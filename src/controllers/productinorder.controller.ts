import { Request, Response } from 'express';
import { ProductInOrderService } from '../services/productinorder.service';
import { OrderService } from "../services/order.service";
import { UserService } from "../services/user.service";
import { ProductService } from "../services/product.service";
import { RoomService } from '../services/room.service';
import { Order, ProductInOrder } from '@prisma/client';
import type { OrderResponse, ProductInOrderResponse } from './order.controller';

const productInOrderService = new ProductInOrderService();
const orderService = new OrderService();
const userService = new UserService();
const productService = new ProductService();
const roomService = new RoomService();

export class ProductInOrderController {
  async post(req: Request, res: Response) {
    try {
      const user_id = res.locals.payload.id;
      const { order_id, product_id, count } = req.body;
      const user_exsist = await userService.findById(+user_id)
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found by user_id: " + user_id
        })
      } else {
        const order_exsist = await orderService.findById(+order_id)
        if (!order_exsist) {
          res.status(404).json({
            message: "Order not found by order_id: " + order_id
          })
        } else {
          const product_exsist = await productService.findById(product_id)
          if (!product_exsist) {
            res.status(404).json({
              message: "Product not found by product_id: " + product_id
            })
          } else {
            const productInOrder_created = await productInOrderService.create({ user_id, order_id, product_id, count });
            const productInOrder_updated = await productInOrderService.updateTotalPrice(productInOrder_created.id, productInOrder_created.product.price * productInOrder_created.count)
            res.status(201).json({
              message: "Product In Order success created",
              productInOrder: productInOrder_updated
            })
          }
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating Product In Order' });
    }
  }
  async put(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { product_id, count } = req.body;
      const productInOrder_exsist = await productInOrderService.findById(+id);
      if (!productInOrder_exsist) {
        res.status(404).json({ error: 'Product In Order not found' });
      } else {
        const productInOrder_updated = await productInOrderService.update(productInOrder_exsist.id, +product_id, +count);
        const proInOrder_updated = await productInOrderService.updateTotalPrice(productInOrder_updated.id, productInOrder_updated.product.price * productInOrder_updated.count)
        if (productInOrder_updated.status == 1) {
          const order = (await orderService.findById(productInOrder_updated.order_id))!
          let order_total_price: number = order.total_price
          order_total_price -= productInOrder_exsist.total_price
          order_total_price += proInOrder_updated.total_price
          await orderService.updateTotal(order.id, order_total_price)
          res.status(200).json({
            message: "Product In Order success updated",
            productInOrder: proInOrder_updated,
          });
        } else {
          res.status(200).json({
            message: "Product In Order success updated",
            productInOrder: proInOrder_updated,
          });
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating Product In Order' });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productInOrder_exsist = await productInOrderService.findById(+id);
      if (!productInOrder_exsist) {
        res.status(404).json({ error: 'Product In Order not found by id: ' + id });
      } else {
        const productInOrder_deleted = await productInOrderService.delete(productInOrder_exsist.id);
        const order_product = (await orderService.findById(productInOrder_deleted.order_id))!
        if (productInOrder_deleted.status == 1) {
          let total_price_order = order_product.total_price
          total_price_order -= productInOrder_deleted.total_price
          await orderService.updateTotal(order_product.id, total_price_order)
          res.status(200).json({
            message: "Product In Order success deleted",
            productInOrder: productInOrder_deleted
          })
        } else {
          res.status(200).json({
            message: "Product In Order success deleted",
            productInOrder: productInOrder_deleted
          })
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting Product In Order' });
    }
  }
  // to do
  // async get(req: Request, res: Response) {
  //   try {
  //     const { order_id, product_id } = req.query
  //     async function findProductInOrders(productInOrders: ProductInOrder[]) {
  //       let productInOrdersRes: ProductInOrderResponse[] = []
  //       for (let i = 0; i < productInOrders.length; i++) {
  //         const order = await orderService.findById(productInOrders[i].order_id)
  //         const product = await productService.findCustomById(productInOrders[i].product_id)
  //         const user = await userService.findCustomById(productInOrders[i].user_id)
  //         if (order !== null && product !== null && user !== null) {
  //           let proInOrderRes: ProductInOrderResponse = {
  //             id: productInOrders[i].id,
  //             user,
  //             order_id: order.id,
  //             product,
  //             count: productInOrders[i].count,
  //             total_price: productInOrders[i].total_price,
  //             status: productInOrders[i].status,
  //             create_date: productInOrders[i].create_date,
  //             update_date: productInOrders[i].update_date
  //           }
  //           productInOrdersRes.push(proInOrderRes)
  //         }
  //       } return productInOrdersRes
  //     }
  //     if (order_id !== undefined && order_id !== '') {
  //       const order = await orderService.findById(+order_id)
  //       if (!order) {
  //         res.status(404).json({
  //           message: "Order not found by order_id: " + order
  //         })
  //       } else {
  //         if (product_id !== undefined && product_id !== '') {
  //           const product = await productService.findById(+product_id)
  //           if (!product) {
  //             res.status(404).json({
  //               message: "Product not found by id: " + product_id
  //             })
  //           } else {
  //             const productInOrders = await productInOrderService.findByOrderProduct(order.id, product.id)
  //             const pro_res = await findProductInOrders(productInOrders)
  //             res.status(200).json({
  //               message: "Prouct In Orders by order_id: " + order_id + " and product_id: " + product_id,
  //               productInOrders: pro_res
  //             })
  //           }

  //         } else {
  //           const productInOrders = await productInOrderService.findByOrderId(order.id)
  //           const pro_res = await findProductInOrders(productInOrders)
  //           res.status(200).json({
  //             message: "Product In Orders by order_id: " + order_id,
  //             productInOrders: pro_res
  //           })
  //         }
  //       }
  //     } else if (product_id !== undefined && product_id !== '') {
  //       const product = await productService.findById(+product_id)
  //       if (!product) {
  //         res.status(404).json({
  //           message: "Product not found by id: " + product_id
  //         })
  //       } else {
  //         const productInOrders = await productInOrderService.findByProductId(product.id)
  //         const pro_res = await findProductInOrders(productInOrders)
  //         res.status(200).json({
  //           message: "Prouct In Orders by product_id: " + product_id,
  //           productInOrders: pro_res
  //         })
  //       }
  //     } else {
  //       const productInOrders = await productInOrderService.findAll()
  //       const pro_res = await findProductInOrders(productInOrders)
  //       res.status(200).json({
  //         message: "All Prouct In Orders",
  //         productInOrders: pro_res
  //       })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error fetching Product In Orders' });
  //   }
  // }
  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params 
        const productInOrders = await productInOrderService.findCustomByStatus(+status)
        res.status(200).json({
          message: "All Prouct In Orders status: 0",
          productInOrders: productInOrders
        })
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Product In Orders' });
    }
  }
  async patchStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body
      const proInOrder_exsist = await productInOrderService.findById(+id)
      if (!proInOrder_exsist) {
        res.status(404).json({
          message: "Product In Order not found by id: " + id
        })
      }
      else {
        const proInOrder_updated = await productInOrderService.updateStatus(+id, +status)
        const order_product = await orderService.findById(proInOrder_updated.order_id)
        if (order_product !== null) {
          let total_price_order: number
          // update order total price
          if (+status === 1) {
            total_price_order = order_product.total_price + proInOrder_updated.total_price
          } else {
            total_price_order = order_product.total_price - proInOrder_updated.total_price
          }
          await orderService.updateTotal(order_product.id, total_price_order)
          res.status(201).json({
            message: "Product status success updated",
            productInOrder: proInOrder_updated
          })
        }
      }
    }
    catch (error) {
      res.json({ message: "Error patching status Product In Order" })
    }
  }
}
