import express from "express";
import { CategoryController } from '../controllers/category.controller';
import { createValidator } from 'express-joi-validation';
import { categoryValidationSchema } from "../validations/category.validation";
import { checkAdmin } from "../middlewares/user.middleware";

const router = express.Router();
const validator = createValidator();
const categoryController = new CategoryController()

router.post('/', checkAdmin, validator.body(categoryValidationSchema), categoryController.post);
router.get('/', categoryController.get)
router.delete('/:id', checkAdmin, categoryController.delete)
// router.put('/:id', validator.body(categoryValidationSchema), updateCategory);
// router.get('/:id', getCategory);

export default router;
