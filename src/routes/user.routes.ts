import express from 'express';
import { UserController } from "../controllers/user.controller";
import { createValidator } from 'express-joi-validation';
import { userValidationSchemaRegister } from '../validations/user.validation'; // Define userValidationSchema in a separate file

const router = express.Router();
const validator = createValidator();
const userController = new UserController()

router.post('/', validator.body(userValidationSchemaRegister), userController.post);
router.get('/', userController.get)
// router.put('/:id', validator.body(userValidationSchema), updateUser);
// router.delete('/:id', deleteUser);
// router.get('/:id', getUser);

export default router;
