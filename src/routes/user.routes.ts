import express from 'express';
import { UserController } from "../controllers/user.controller";
import { createValidator } from 'express-joi-validation';
import { userValidationSchemaRegister } from '../validations/user.validation'; // Define userValidationSchema in a separate file
import { checkAdmin, checkToken } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const userController = new UserController()

router.post('/register', validator.body(userValidationSchemaRegister), checkAdmin, userController.register);
router.get('/', checkAdmin, userController.getAll)
router.post('/login', userController.login)
router.get('/verify', checkToken, userController.getVerify)
// router.put('/:id', validator.body(userValidationSchema), updateUser);
// router.delete('/:id', deleteUser);
// router.get('/:id', getUser);

export default router;
