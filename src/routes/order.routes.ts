import express from 'express';
import { OrderController } from './order.controller';
import expressJoiValidation from 'express-joi-validation';
import { orderValidationSchema } from './order.validation'; // Define orderValidationSchema in a separate file

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const orderController = new OrderController();

router.post('/', validator.body(orderValidationSchema), orderController.createOrder);
router.put('/:id', validator.body(orderValidationSchema), orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/:id', orderController.getOrder);

export default router;
