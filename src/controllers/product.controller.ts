import { Request, Response } from 'express';
import ProductService from './product.service';

const productService = new ProductService();

export class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, price, category_id, desc, image } = req.body;
      const product = await productService.createProduct({ name, price, category_id, desc, image });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    const productId = parseInt(req.params.id);
    const { name, price, category_id, desc, image } = req.body;

    try {
      const product = await productService.updateProduct(productId, { name, price, category_id, desc, image });
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const productId = parseInt(req.params.id);

    try {
      const product = await productService.deleteProduct(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }

  async getProduct(req: Request, res: Response) {
    const productId = parseInt(req.params.id);

    try {
      const product = await productService.getProduct(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product' });
    }
  }
}

export default new ProductController();
