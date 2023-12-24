import express from "express";
import { CategoryController } from '../controllers/category.controller';
import { createValidator } from 'express-joi-validation';
import { categoryPostSchema, categoryPutSchema } from "../validations/category.validation";
import { checkAdmin, checkToken } from "../middlewares/user.middleware";

const router = express.Router();
const validator = createValidator();
const categoryController = new CategoryController()

router.post('/',   checkAdmin, validator.body(categoryPostSchema), categoryController.post);
router.get('/',   categoryController.get)
router.delete('/:id',   checkAdmin, categoryController.delete)
router.put('/:id',   checkAdmin, validator.body(categoryPutSchema), categoryController.put);

export default router;
