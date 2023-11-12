import express from 'express';
import { OrderController } from '../controllers/order.controller';
import expressJoiValidation from 'express-joi-validation';
import { orderValidationSchema } from '../validations/order.validation'; // Define orderValidationSchema in a separate file

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const orderController = new OrderController();

router.post('/', validator.body(orderValidationSchema), orderController.post);
router.put('/:id', validator.body(orderValidationSchema), orderController.put);
router.delete('/:id', orderController.delete);
router.get('/', orderController.get);
router.get('/:id', orderController.getById)

export default router;
