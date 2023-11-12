import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async post(req: Request, res: Response) {
    try {
      const { name, price, category_id, desc } = req.body;
      const product_exsist = await productService.findByName(name)
      if(product_exsist) {
        res.status(403).json({
          message: "Product already exsist by name: " + name,
          product: product_exsist
        })
      } else {
        const product = await productService.create({ name, price, category_id, desc });
        res.status(201).json({
          message: "Product success created",
          product
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  }

  // async put(req: Request, res: Response) {
  //   const productId = parseInt(req.params.id);
  //   const { name, price, category_id, desc, image } = req.body;

  //   try {
  //     const product = await productService.update(productId, { name, price, category_id, desc, image });
  //     if (product) {
  //       res.json(product);
  //     } else {
  //       res.status(404).json({ error: 'Product not found' });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error updating product' });
  //   }
  // }

  async delete(req: Request, res: Response) {
    const { id } = req.params
    try {
      const product = await productService.delete(+id);
      if (product) {
        res.status(200).json({
          message: "Product success deleted",
          product
        });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params
    try {
      const product = await productService.findById(+id);
      if (product) {
        res.status(200).json({
          message: "Product by id: " + id,
          product
        });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product' });
    }
  }

  async get(req: Request, res: Response) {
    const { category_id } = req.query
    try {
      if(category_id){
        const products = await productService.findByCategoryId(+category_id)
        if(products.length == 0) {
          res.status(404).json({
            message: "No products by category id: " + category_id,
            products
          })
        } else {
          res.status(200).json({
            message: "Products by category id: " + category_id,
            products
          })
        }
      } else {
        const products = await productService.findMany()
          res.status(200).json({
            message: "All products",
            products
          })
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product' });
    }
  }
}

export default new ProductController();
