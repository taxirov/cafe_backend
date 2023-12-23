import express from "express";
import { addHeaders, checkAdmin } from "../middlewares/user.middleware";
import { createValidator } from "express-joi-validation";
import { ProductController } from "../controllers/product.controller";
import { productPostSchema, productPutSchema, productGetSchema } from "../validations/product.validation";

const router = express.Router();
const validator = createValidator();
const productController = new ProductController();

router.post('/', addHeaders, checkAdmin, validator.body(productPostSchema), productController.post);
router.delete('/:id', addHeaders, checkAdmin, productController.delete);
router.get('/', addHeaders, validator.query(productGetSchema), productController.get);
router.get('/:id', addHeaders, productController.getById);
router.put('/:id', addHeaders, checkAdmin, validator.body(productPutSchema), productController.put)

export default router;
