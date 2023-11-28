import express from 'express';
import { UserController } from "../controllers/user.controller";
import { createValidator } from 'express-joi-validation';
import { userValidationSchemaRegister } from '../validations/user.validation';
import { checkAdmin, checkToken } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const userController = new UserController()

router.post('/register', validator.body(userValidationSchemaRegister), checkAdmin, userController.register) // success endpoint
router.get('/', checkToken, userController.getAll) // success endpoint
router.post('/login', userController.login) // success endpoint
router.get('/verify', checkToken, userController.getTokenVerify) // success endpoint
router.get('/admin', checkAdmin, userController.getAdminVerify) // success endpoint
router.delete('/:id', checkToken, checkAdmin, userController.delete) // success endpoint
router.put('/:id',  checkToken, checkAdmin, userController.put) // success endpoint

export default router;
