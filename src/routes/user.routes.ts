import express from 'express';
import { UserController } from "../controllers/user.controller";
import { createValidator } from 'express-joi-validation';
import { userValidationSchemaRegister } from '../validations/user.validation'; // Define userValidationSchema in a separate file
import { checkAdmin, checkToken } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const userController = new UserController()

router.post('/register', validator.body(userValidationSchemaRegister), checkAdmin, userController.register);
router.get('/', checkToken, checkAdmin, userController.getAll)
router.post('/login', userController.login)
router.get('/verify', checkToken, userController.getVerify)
router.delete('/:id', checkToken, checkAdmin, userController.delete)
router.get('/:id', checkToken, checkAdmin, userController.getById);
router.put('/:id',  checkToken, checkAdmin, userController.put);

export default router;
