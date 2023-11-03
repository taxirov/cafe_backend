import express from 'express';
import { ProductInOrderController } from './productinorder.controller';
import expressJoiValidation from 'express-joi-validation';
import { productInOrderValidationSchema } from './productinorder.validation'; // Define productInOrderValidationSchema in a separate file

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const productInOrderController = new ProductInOrderController();

router.post('/', validator.body(productInOrderValidationSchema), productInOrderController.createProductInOrder);
router.put('/:id', validator.body(productInOrderValidationSchema), productInOrderController.updateProductInOrder);
router.delete('/:id', productInOrderController.deleteProductInOrder);
router.get('/:id', productInOrderController.getProductInOrder);

export default router;
