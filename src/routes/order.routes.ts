import express from 'express';
import { checkToken, checkAdmin } from '../middlewares/user.middleware'
import { OrderController } from '../controllers/order.controller';
import expressJoiValidation from 'express-joi-validation';
import { orderValidationSchema } from '../validations/order.validation'; // Define orderValidationSchema in a separate file

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const orderController = new OrderController();

router.post('/', validator.body(orderValidationSchema), checkToken, orderController.post);
router.put('/:id', validator.body(orderValidationSchema), checkToken, orderController.put);
router.delete('/:id', checkToken, checkAdmin,orderController.delete);
router.get('/', checkToken, orderController.get);
router.get('/:id', checkToken, orderController.getById)
router.patch('/:id', checkToken, orderController.patchStatus)

export default router;
