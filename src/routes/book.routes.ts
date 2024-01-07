import express from 'express';
import { BookController } from '../controllers/book.controller';
import { createValidator } from 'express-joi-validation'
import { checkToken } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const bookController = new BookController();

router.post('/', checkToken, bookController.post);
router.put('/:id', checkToken, bookController.put);
router.delete('/:id', checkToken, bookController.delete);
router.get('/', checkToken, bookController.get);
router.get('/date', checkToken, bookController.date);
router.post('/status', checkToken, bookController.status)

export default router;