import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { CategoryService } from "../services/category.service";

const productService = new ProductService();
const categoryService = new CategoryService();

export class ProductController {
  // done
  async post(req: Request, res: Response) {
    try {
      const { name, price, category_id, desc, created_date } = req.body;
      const product_exsist = await productService.findByName(name)
      if (product_exsist) {
        res.status(403).json({
          message: "Product already exsist by name: " + name,
          product: product_exsist
        })
      } else {
        const category_exsist = await categoryService.findById(+category_id)
        if (!category_exsist) {
          res.status(404).json({
            message: "Category not found by id: " + category_id
          })
        } else {
          const product = await productService.create({ name, price, category_id, desc, created_date });
          res.status(201).json({
            message: "Product success created",
            product
          });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating product' });
    }
  }
  // done
  async put(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, price, category_id, desc } = req.body;
      const product_exsist = await productService.findById(+id)
      if (product_exsist) {
        const category_exsist = await categoryService.findById(+category_id)
        if(!category_exsist) {
          res.status(404).json({
            message: "Category not found by id: " + category_id
          })
        } else {
          const product = await productService.update({ id: +id, name, price, category_id, desc });
        res.status(200).json({
          message: "Product success updated",
          product
        });
        }
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating product' });
    }
  }
  // done
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const product_exsist = await productService.findById(+id);
      if (!product_exsist) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        const product = await productService.delete(+id);
        res.status(200).json({
          message: "Product success deleted",
          product
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product' });
    }
  }
  // done
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
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
      res.status(500).json({ message: 'Error fetching product' });
    }
  }
  // done
  async get(req: Request, res: Response) {
    try {
      const { category_id } = req.query
      if (category_id !== undefined && category_id !== '') {
        const products = await productService.findByCategoryId(+category_id)
        if (products.length == 0) {
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