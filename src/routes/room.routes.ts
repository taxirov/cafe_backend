import express from 'express';
import { checkToken, checkAdmin } from "../middlewares/user.middleware"
import { RoomController } from '../controllers/room.controller';
import expressJoiValidation from 'express-joi-validation';
import { roomValidationSchema } from '../validations/room.validation';

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const roomController = new RoomController();

router.post('/', validator.body(roomValidationSchema), checkToken, checkAdmin, roomController.post);
router.put('/:id', validator.body(roomValidationSchema), checkToken, checkAdmin, roomController.put);
router.delete('/:id', checkToken, checkAdmin, roomController.delete);
router.get('/', checkToken, roomController.get);

export default router;
