import express from 'express';
import { RoleController } from "../controllers/role.controller";
import { createValidator } from 'express-joi-validation';
import { roleBodySchema } from '../validations/role.validation';
import { checkAdmin } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const roleController = new RoleController()

router.post('/', validator.body(roleBodySchema), checkAdmin, roleController.post);
router.get('/', roleController.get)
router.delete('/:id', checkAdmin, roleController.delete)
router.put('/:id',  validator.body(roleBodySchema), checkAdmin,roleController.put)

export default router;
