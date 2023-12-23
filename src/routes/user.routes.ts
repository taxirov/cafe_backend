import express from 'express';
import { UserController } from "../controllers/user.controller";
import { createValidator } from 'express-joi-validation';
import { userValidationSchemaRegister } from '../validations/user.validation';
import { addHeaders, checkAdmin, checkToken } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const userController = new UserController()

router.post('/register', addHeaders, validator.body(userValidationSchemaRegister), checkAdmin, userController.register)
router.get('/', addHeaders, checkToken, userController.getAll)
router.post('/login', addHeaders, userController.login)
router.get('/verify', addHeaders, checkToken, userController.getTokenVerify)
router.get('/admin', addHeaders, checkAdmin, userController.getAdminVerify)
router.delete('/:id', checkToken, checkAdmin, userController.delete)
router.put('/:id', addHeaders,  checkToken, checkAdmin, userController.put)
router.patch('/:id', addHeaders, checkToken, checkAdmin, userController.patchStatus)

export default router;
