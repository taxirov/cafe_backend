import express from 'express';
import { checkToken, checkAdmin, addHeaders } from '../middlewares/user.middleware'
import { OrderController } from '../controllers/order.controller';
import expressJoiValidation from 'express-joi-validation';
import { orderPostSchema, orderPutSchema, orderGetSchema } from '../validations/order.validation';

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const orderController = new OrderController();

router.post('/', addHeaders, validator.body(orderPostSchema), checkToken, orderController.post);
router.put('/:id', addHeaders, validator.body(orderPutSchema), checkToken, orderController.put);
router.delete('/:id', addHeaders, checkToken, checkAdmin, orderController.delete);
router.get('/', addHeaders, validator.query(orderGetSchema), checkToken, orderController.get)
router.get('/waiter', addHeaders, checkToken, orderController.getWaiter)
router.get('/date', addHeaders, checkToken, orderController.getByYearMonthDay)
router.patch('/:id/status', addHeaders, checkToken, checkAdmin, orderController.patchStatus)

export default router;
