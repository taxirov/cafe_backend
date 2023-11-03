import { Request, Response } from 'express';
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();

export class CategoryController {
    public post = async (req: Request, res: Response) => {
      try {
        const { name, desc } = req.body;
        const category = await categoryService.create({ name, desc });
        res.status(201).json(category);
      } catch (error) {
        res.status(500).json({ error: 'Error creating category' });
      }
    };
    public get = async (req: Request, res: Response) => {
        try {
            const categories = await categoryService.findAll()
            res.status(200).json({
                message: "All categories",
                categories
            })
        } catch(error) {
            res.status(500).json({ error: "Error getting categories"})
        }
    }
}

// export const updateCategory = async (req: Request, res: Response) => {
//   const categoryId = parseInt(req.params.id);
//   const { name, desc, image } = req.body;

//   try {
//     const category = await categoryService.update(categoryId, { name, desc, image });
//     if (category) {
//       res.json(category);
//     } else {
//       res.status(404).json({ error: 'Category not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating category' });
//   }
// };

// export const deleteCategory = async (req: Request, res: Response) => {
//   const categoryId = parseInt(req.params.id);

//   try {
//     const category = await categoryService.deleteCategory(categoryId);
//     if (category) {
//       res.json(category);
//     } else {
//       res.status(404).json({ error: 'Category not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error deleting category' });
//   }
// };

// export const getCategory = async (req: Request, res: Response) => {
//   const categoryId = parseInt(req.params.id);

//   try {
//     const category = await categoryService.getCategory(categoryId);
//     if (category) {
//       res.json(category);
//     } else {
//       res.status(404).json({ error: 'Category not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching category' });
//   }
// };
