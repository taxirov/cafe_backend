import express from 'express';
import { CategoryController } from '../controllers/category.controller';
import { createValidator } from 'express-joi-validation';
import { categoryValidationSchema } from "../validations/category.validation";

const router = express.Router();
const validator = createValidator();
const categoryController = new CategoryController()

router.post('/category', validator.body(categoryValidationSchema), categoryController.post);
router.get('/category', categoryController.get)
// router.put('/:id', validator.body(categoryValidationSchema), updateCategory);
// router.delete('/:id', deleteCategory);
// router.get('/:id', getCategory);

export default router;
