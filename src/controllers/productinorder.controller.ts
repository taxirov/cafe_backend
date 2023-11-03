import { Request, Response } from 'express';
import ProductInOrderService from './productinorder.service';

const productInOrderService = new ProductInOrderService();

export class ProductInOrderController {
  async createProductInOrder(req: Request, res: Response) {
    try {
      const { user_id, order_id, product_id } = req.body;
      const productInOrder = await productInOrderService.createProductInOrder({ user_id, order_id, product_id });
      res.status(201).json(productInOrder);
    } catch (error) {
      res.status(500).json({ error: 'Error creating ProductInOrder' });
    }
  }

  async updateProductInOrder(req: Request, res: Response) {
    const productInOrderId = parseInt(req.params.id);
    const { user_id, order_id, product_id } = req.body;

    try {
      const productInOrder = await productInOrderService.updateProductInOrder(productInOrderId, { user_id, order_id, product_id });
      if (productInOrder) {
        res.json(productInOrder);
      } else {
        res.status(404).json({ error: 'ProductInOrder not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating ProductInOrder' });
    }
  }

  async deleteProductInOrder(req: Request, res: Response) {
    const productInOrderId = parseInt(req.params.id);

    try {
      const productInOrder = await productInOrderService.deleteProductInOrder(productInOrderId);
      if (productInOrder) {
        res.json(productInOrder);
      } else {
        res.status(404).json({ error: 'ProductInOrder not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting ProductInOrder' });
    }
  }

  async getProductInOrder(req: Request, res: Response) {
    const productInOrderId = parseInt(req.params.id);

    try {
      const productInOrder = await productInOrderService.getProductInOrder(productInOrderId);
      if (productInOrder) {
        res.json(productInOrder);
      } else {
        res.status(404).json({ error: 'ProductInOrder not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching ProductInOrder' });
    }
  }
}

export default new ProductInOrderController();
