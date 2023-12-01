import { Request, Response } from 'express';
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();

export class CategoryController {
  async post(req: Request, res: Response) {
    try {
      const { name, desc } = req.body;
      const exsist_category = await categoryService.findByName(name);
      if (exsist_category) {
        res.status(403).json({
          message: "Category already exsist"
        })
      } else {
        const category = await categoryService.create({ name, desc });
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
      res.status(200).json({
        message: "All categories",
        categories
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
        const category = await categoryService.delete(+id)
        res.status(200).json({
          message: category.name + " category deleted",
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
      if(!category_exsist) {
        res.status(404).json({
          message: "Category not found by id: " + id
        })
      } else {
        const category = await categoryService.update(+id, name, desc)
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