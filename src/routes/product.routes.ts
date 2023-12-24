import express from "express";
import {  checkAdmin } from "../middlewares/user.middleware";
import { createValidator } from "express-joi-validation";
import { ProductController } from "../controllers/product.controller";
import { productPostSchema, productPutSchema, productGetSchema } from "../validations/product.validation";

const router = express.Router();
const validator = createValidator();
const productController = new ProductController();

router.post('/',   checkAdmin, validator.body(productPostSchema), productController.post);
router.delete('/:id',   checkAdmin, productController.delete);
router.get('/',   validator.query(productGetSchema), productController.get);
router.get('/:id',   productController.getById);
router.put('/:id',   checkAdmin, validator.body(productPutSchema), productController.put)

export default router;
