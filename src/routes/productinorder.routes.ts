import express from 'express';
import { addHeaders, checkAdmin, checkToken } from "../middlewares/user.middleware"
import { ProductInOrderController } from '../controllers/productinorder.controller';
import expressJoiValidation from 'express-joi-validation';
import { prInOrValidationSchema, prInOrPutValidationSchema } from '../validations/productinorder.validation';

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const productInOrderController = new ProductInOrderController();

router.post('/', addHeaders, checkToken, validator.body(prInOrValidationSchema), productInOrderController.post);
router.put('/:id', addHeaders, checkToken, validator.body(prInOrPutValidationSchema), productInOrderController.put);
router.delete('/:id', addHeaders, checkToken, productInOrderController.delete);
// router.get('/', checkToken, productInOrderController.get);
router.get('/status/:status', addHeaders, checkToken, productInOrderController.getByStatus)
router.patch('/:id/status', addHeaders, checkToken, productInOrderController.patchStatus)

export default router;
