import { Request, Response } from 'express';
import { ProductInOrderService } from '../services/productinorder.service';
import { OrderService } from "../services/order.service";
import { UserService } from "../services/user.service";
import { ProductService } from "../services/product.service"

const productInOrderService = new ProductInOrderService();
const orderService = new OrderService()
const userService = new UserService()
const productService = new ProductService()

export class ProductInOrderController {
  async post(req: Request, res: Response) {
    const user_id = res.locals.payload.id
    const { order_id, product_id, count, created_date } = req.body;
    try {
      const user_exsist = await userService.findById(+user_id)
      if(!user_exsist) {
        res.status(404).json({
          message: "User not found by user_id: " + user_id
        })
      } else {
        const order_exsist = await orderService.findById(+order_id)
        if(!order_exsist) {
          res.status(404).json({
            message: "Order not found by order_id: " + order_id
          })
        } else {
          const product_exsist = await productService.findById(product_id)
          if(!product_exsist) {
            res.status(404).json({
              message: "Product not found by product_id: " + product_id
            })
          } else {
            const productInOrder = await productInOrderService.create({ user_id, order_id, product_id, count, created_date });
            res.status(201).json({
              message: "Product success created",
              productInOrder
            });
          }
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Error creating ProductInOrder' });
    }
  }

  async put(req: Request, res: Response) {
    const { id } = req.params;
    const { product_id, count } = req.body;
    try {
      const productInOrder = await productInOrderService.update(+id, product_id, count );
      if (productInOrder) {
        res.status(200).json({
          message: "ProductInOrder success updated",
          productInOrder
        });
      } else {
        res.status(404).json({ error: 'ProductInOrder not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating ProductInOrder' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const productInOrder = await productInOrderService.delete(+id);
      if (productInOrder) {
        res.status(200).json({
          message: "ProductInOrder success deleted",
          productInOrder
        });
      } else {
        res.status(404).json({ error: 'ProductInOrder not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting ProductInOrder' });
    }
  }

  async get(req: Request, res: Response) {
    const payload = res.locals.payload
    const { order_id } = req.query
    try {
      if(order_id !== undefined && order_id !== '') {
        const order = await orderService.findById(+order_id)
        if(!order) {
          res.status(404).json({
            message: "Order not found by order_id: " + order
          })
        } else {
          if(payload.id === order.user_id) {
            const productInOrders = await productInOrderService.findByOrderId(+order_id)
              res.status(200).json({
              message: "ProuctInOrders by order_id: " + order_id,
              productInOrders
            })
          } else {
            if(payload.role === "admin") {
              const productInOrders = await productInOrderService.findByOrderId(+order_id)
              res.status(200).json({
                message: "ProuctInOrders by order_id: " + order_id,
                productInOrders
              })
            } else {
              res.status(403).json({
                message: "Order ownership is not available"
              })
            }
          }
        }
      } else {
        const productInOrders = await productInOrderService.findAll()
        res.status(200).json({
          message: "All productInOrders",
          productInOrders
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching ProductInOrder' });
    }
  }

  async getByProductId(req: Request, res: Response) {

  }
}

export default new ProductInOrderController();
