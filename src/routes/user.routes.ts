import express from 'express';
import { UserController } from "../controllers/user.controller";
import { createValidator } from 'express-joi-validation';
import { userValidationSchemaRegister } from '../validations/user.validation';
import { checkAdmin, checkToken } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const userController = new UserController()

router.post('/register',   validator.body(userValidationSchemaRegister), checkAdmin, userController.register)
router.get('/',   checkToken, userController.getAll)
router.post('/login',   userController.login)
router.get('/verify',   checkToken, userController.getTokenVerify)
router.get('/admin',   checkAdmin, userController.getAdminVerify)
router.delete('/:id', checkToken, checkAdmin, userController.delete)
router.put('/:id',    checkToken, checkAdmin, userController.put)
router.patch('/:id',   checkToken, checkAdmin, userController.patchStatus)

export default router;
