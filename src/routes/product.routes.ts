import express from "express";
import { checkAdmin } from "../middlewares/user.middleware";
import { createValidator } from "express-joi-validation";
import { ProductController } from "../controllers/product.controller";
import { productBodySchema } from "../validations/product.validation";

const router = express.Router();
const validator = createValidator();
const productController = new ProductController();

router.post('/', checkAdmin, validator.body(productBodySchema), productController.post);
router.delete('/:id', checkAdmin, productController.delete);
router.get('/', productController.get);
router.get('/:id', productController.getById);

export default router;
