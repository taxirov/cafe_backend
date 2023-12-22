import express from 'express';
import { checkAdmin, checkToken } from "../middlewares/user.middleware"
import { ProductInOrderController } from '../controllers/productinorder.controller';
import expressJoiValidation from 'express-joi-validation';
import { prInOrValidationSchema, prInOrPutValidationSchema } from '../validations/productinorder.validation';

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const productInOrderController = new ProductInOrderController();

router.post('/', checkToken, validator.body(prInOrValidationSchema), productInOrderController.post);
router.put('/:id', checkToken, validator.body(prInOrPutValidationSchema), productInOrderController.put);
router.delete('/:id', checkToken, productInOrderController.delete);
// router.get('/', checkToken, productInOrderController.get);
router.get('/status/:status', checkToken,  productInOrderController.getByStatus)
router.patch('/:id/status', checkToken, productInOrderController.patchStatus)

export default router;
