import { Request, Response } from 'express';
import { ProductInOrderService } from '../services/productinorder.service';
import { OrderService } from "../services/order.service";
import { UserService } from "../services/user.service";
import { ProductService } from "../services/product.service";
import { ProductInOrder } from '@prisma/client';

const productInOrderService = new ProductInOrderService();
const orderService = new OrderService();
const userService = new UserService();
const productService = new ProductService();

export type ProductInOrderRes = {
  id: number,
  user: { id: number, name: string }
  order_id: number,
  product: { id: number, name: string, price: number, image: string | null },
  count: number,
  total_price: number,
  created_date: string,
  update_date: string,
  status: number
}

export class ProductInOrderController {
  // done  
  async post(req: Request, res: Response) {
    try {
      const user_id = res.locals.payload.id;
      const { order_id, product_id, count, created_date } = req.body;
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
            const order = await orderService.findById(+order_id)
            const productInOrder = await productInOrderService.create({ user_id, order_id, product_id, count, created_date });
            const product = await productService.findCustomById(+product_id)
            const user = await userService.findCustomById(user_exsist.id)
            if (order !== null && product !== null && user !== null) {
              // update product_in_product total price
              const proInOrder_updated = await productInOrderService.updateTotalPrice(productInOrder.id, product.price * productInOrder.count)
              let proInOrderRes: ProductInOrderRes = {
                id: proInOrder_updated.id,
                user,
                order_id: order.id,
                product,
                count: proInOrder_updated.count,
                total_price: proInOrder_updated.total_price,
                status: proInOrder_updated.status,
                created_date: proInOrder_updated.created_date,
                update_date: proInOrder_updated.update_date.toString()
              }
              res.status(201).json({
                message: "Product In Order success created",
                productInOrder: proInOrderRes
              });
            }
          }
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating Product In Order' });
    }
  }
  // done
  async put(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { order_id, product_id, count } = req.body;
      const productInOrder_exsist = await productInOrderService.findById(+id);
      if (!productInOrder_exsist) {
        res.status(404).json({ error: 'Product In Order not found' });
      } else {
        const productInOrder_updated = await productInOrderService.update(productInOrder_exsist.id, +order_id, +product_id, +count);
        const order = await orderService.findById(productInOrder_updated.order_id)
        const product = await productService.findCustomById(productInOrder_updated.product_id)
        const user = await userService.findCustomById(productInOrder_updated.user_id)
        if (order !== null && product !== null && user !== null) {
          let proInOrderRes: ProductInOrderRes = {
            id: productInOrder_updated.id,
            user,
            order_id: order.id,
            product,
            count: productInOrder_updated.count,
            total_price: productInOrder_updated.total_price,
            status: productInOrder_updated.status,
            created_date: productInOrder_updated.created_date,
            update_date: productInOrder_updated.update_date.toString()
          }
          res.status(200).json({
            message: "Product In Order success updated",
            productInOrder: proInOrderRes
          });
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating Product In Order' });
    }
  }
  // done
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productInOrder_exsist = await productInOrderService.findById(+id);
      if (!productInOrder_exsist) {
        res.status(404).json({ error: 'Product In Order not found by id: ' + id });
      } else {
        const productInOrder_deleted = await productInOrderService.delete(productInOrder_exsist.id);
        const order = await orderService.findById(productInOrder_deleted.order_id)
        const product = await productService.findCustomById(productInOrder_deleted.product_id)
        const user = await userService.findCustomById(productInOrder_deleted.user_id)
        if (order !== null && product !== null && user !== null) {
          let proInOrderRes: ProductInOrderRes = {
            id: productInOrder_deleted.id,
            user,
            order_id: order.id,
            product,
            count: productInOrder_deleted.count,
            total_price: productInOrder_deleted.total_price,
            status: productInOrder_deleted.status,
            created_date: productInOrder_deleted.created_date,
            update_date: productInOrder_deleted.update_date.toString()
          }
          res.status(201).json({
            message: "Product In Order success deleted",
            productInOrder: proInOrderRes
          })
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting Product In Order' });
    }
  }
  // done
  async get(req: Request, res: Response) {
    try {
      const { order_id, product_id } = req.query
      async function findProductInOrders(productInOrders: ProductInOrder[]) {
        let productInOrdersRes: ProductInOrderRes[] = []
        for (let i = 0; i < productInOrders.length; i++) {
          const order = await orderService.findById(productInOrders[i].order_id)
          const product = await productService.findCustomById(productInOrders[i].product_id)
          const user = await userService.findCustomById(productInOrders[i].user_id)
          if (order !== null && product !== null && user !== null) {
            let proInOrderRes: ProductInOrderRes = {
              id: productInOrders[i].id,
              user,
              order_id: order.id,
              product,
              count: productInOrders[i].count,
              total_price: productInOrders[i].total_price,
              status: productInOrders[i].status,
              created_date: productInOrders[i].created_date,
              update_date: productInOrders[i].update_date.toString()
            }
            productInOrdersRes.push(proInOrderRes)
          }
        } return productInOrdersRes
      }
      if (order_id !== undefined && order_id !== '') {
        const order = await orderService.findById(+order_id)
        if (!order) {
          res.status(404).json({
            message: "Order not found by order_id: " + order
          })
        } else {
          if (product_id !== undefined && product_id !== '') {
            const product = await productService.findById(+product_id)
            if (!product) {
              res.status(404).json({
                message: "Product not found by id: " + product_id
              })
            } else {
              const productInOrders = await productInOrderService.findByOrderProduct(order.id, product.id)
              const pro_res = await findProductInOrders(productInOrders)
              res.status(200).json({
                message: "Prouct In Orders by order_id: " + order_id + " and product_id: " + product_id,
                productInOrders: pro_res
              })
            }

          } else {
            const productInOrders = await productInOrderService.findByOrderId(order.id)
            const pro_res = await findProductInOrders(productInOrders)
            res.status(200).json({
              message: "Product In Orders by order_id: " + order_id,
              productInOrders: pro_res
            })
          }
        }
      } else if(product_id !== undefined && product_id !== '') {
          const product = await productService.findById(+product_id)
          if (!product) {
            res.status(404).json({
              message: "Product not found by id: " + product_id
            })
          } else {
            const productInOrders = await productInOrderService.findByProductId(product.id)
            const pro_res = await findProductInOrders(productInOrders)
            res.status(200).json({
              message: "Prouct In Orders by product_id: " + product_id,
              productInOrders: pro_res
            })
          }
      } else {
        const productInOrders = await productInOrderService.findAll()
            const pro_res = await findProductInOrders(productInOrders)
            res.status(200).json({
              message: "All Prouct In Orders",
              productInOrders: pro_res
            })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Product In Orders' });
    }
  }
  // done
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
        const product = await productService.findCustomById(proInOrder_updated.product_id)
        const user = await userService.findCustomById(proInOrder_updated.user_id)
        if (order_product !== null && product !== null && user !== null) {
          let total_price_order: number
          // update order total price
          if (+status === 1) {
            total_price_order = order_product.total_price + proInOrder_updated.total_price
          } else {
            total_price_order = order_product.total_price - proInOrder_updated.total_price
          }
          const order_pro_updated = await orderService.updateTotal(order_product.id, total_price_order)
          let proInOrderRes: ProductInOrderRes = {
            id: proInOrder_updated.id,
            user,
            order_id: order_pro_updated.id,
            product,
            count: proInOrder_updated.count,
            total_price: proInOrder_updated.total_price,
            status: proInOrder_updated.status,
            created_date: proInOrder_updated.created_date,
            update_date: proInOrder_updated.update_date.toString()
          }
          res.status(201).json({
            message: "Product status success updated",
            productInOrder: proInOrderRes
          })
        }
      }
    }
    catch (error) {
      res.json({ message: "Error patching status Product In Order" })
    }
  }
}
