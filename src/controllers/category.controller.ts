import { Request, Response } from 'express';
import { CategoryService } from "../services/category.service";
import { ProductService } from "../services/product.service";
import { Product } from '@prisma/client';

const categoryService = new CategoryService();
const productService = new ProductService();

type CategoryResponse = { id: number, name: string, desc: string | null, image: string | null, products: Product[], create_date: Date, update_date: Date }

export class CategoryController {
  async post(req: Request, res: Response) {
    try {
      const { name, desc } = req.body;
      const exsist_category = await categoryService.findByName(name);
      if (exsist_category) {
        res.status(409).json({
          message: "Category already exsist"
        })
      } else {
        const category_created = await categoryService.create({ name, desc });
        let category: CategoryResponse = {
          id: category_created.id,
          name: category_created.name,
          desc: category_created.desc,
          image: category_created.image,
          products: await productService.findByCategoryId(category_created.id),
          create_date: category_created.create_date,
          update_date: category_created.update_date
        }
        res.status(201).json({
          message: "Category created",
          category
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating category' });
    }
  }
  async get(req: Request, res: Response) {
    try {
      const categories = await categoryService.findAll()
      let categoriesResponse: CategoryResponse[] = []
      for (let i = 0; i < categories.length; i++) {
        const products = await productService.findByCategoryId(categories[i].id)
        let category: CategoryResponse =  {
          id: categories[i].id,
          name: categories[i].name,
          desc: categories[i].desc,
          image: categories[i].image,
          products,
          create_date: categories[i].create_date,
          update_date: categories[i].update_date
        }
        categoriesResponse.push(category)
      }
      res.status(200).json({
        message: "All categories",
        categories: categoriesResponse
      })
    } catch (error) {
      res.status(500).json({ message: "Error getting categories" })
    }
  }
  async delete(req: Request, res: Response) {
    const { id } = req.params
    try {
      const exsist_category = await categoryService.findById(+id)
      if (!exsist_category) {
        res.status(404).json({
          message: "Not found category with id: " + id
        })
      } else {
        const category_deleted = await categoryService.delete(+id)
        let category: CategoryResponse = {
          id: category_deleted.id,
          name: category_deleted.name,
          desc: category_deleted.desc,
          image: category_deleted.image,
          products: await productService.findByCategoryId(category_deleted.id),
          create_date: category_deleted.create_date,
          update_date: category_deleted.update_date
        }
        res.status(200).json({
          message: "Category success deleted",
          category
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting category"
      })
    }
  }
  async put(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, desc } = req.body
      const category_exsist = await categoryService.findById(+id)
      if (!category_exsist) {
        res.status(404).json({
          message: "Category not found by id: " + id
        })
      } else {
        const category_updated = await categoryService.update(+id, name, desc)
        let category: CategoryResponse = {
          id: category_updated.id,
          name: category_updated.name,
          desc: category_updated.desc,
          image: category_updated.image,
          products: await productService.findByCategoryId(category_updated.id),
          create_date: category_updated.create_date,
          update_date: category_updated.update_date
        }
        res.status(200).json({
          message: "Category success updated",
          category
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error creating category"
      })
    }
  }
}