import express from 'express';
import { RoomController } from './room.controller';
import expressJoiValidation from 'express-joi-validation';
import { roomValidationSchema } from './room.validation'; // Define roomValidationSchema in a separate file

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const roomController = new RoomController();

router.post('/', validator.body(roomValidationSchema), roomController.createRoom);
router.put('/:id', validator.body(roomValidationSchema), roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);
router.get('/:id', roomController.getRoom);

export default router;
