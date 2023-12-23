import express from 'express';
import { RoleController } from '../controllers/role.controller';
import { createValidator } from 'express-joi-validation';
import { roleBodySchema } from '../validations/role.validation';
import { addHeaders, checkAdmin } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const roleController = new RoleController();

router.post('/', addHeaders, validator.body(roleBodySchema), checkAdmin, roleController.post);
router.get('/', addHeaders, roleController.get);
router.delete('/:id', addHeaders, checkAdmin, roleController.delete);
router.put('/:id', addHeaders, validator.body(roleBodySchema), checkAdmin, roleController.put);

export default router;
