import express from 'express';
import { checkToken, checkAdmin } from '../middlewares/user.middleware'
import { OrderController } from '../controllers/order.controller';
import expressJoiValidation from 'express-joi-validation';
import { orderPostSchema, orderPutSchema } from '../validations/order.validation';

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const orderController = new OrderController();

router.post('/', validator.body(orderPostSchema), checkToken, orderController.post);
router.put('/:id', validator.body(orderPutSchema), checkToken, orderController.put);
router.delete('/:id', checkToken, checkAdmin,orderController.delete);
// router.get('/', checkToken, orderController.get)
// router.patch('/:id/status', checkToken, orderController.patchStatus)

export default router;
