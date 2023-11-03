import express from 'express';
import { ProductController } from './product.controller';
import expressJoiValidation from 'express-joi-validation';
import { productValidationSchema } from './product.validation'; // Define productValidationSchema in a separate file

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const productController = new ProductController();

router.post('/', validator.body(productValidationSchema), productController.createProduct);
router.put('/:id', validator.body(productValidationSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProduct);

export default router;
