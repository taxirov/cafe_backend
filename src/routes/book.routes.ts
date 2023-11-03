import express from 'express';
import { BookController } from './book.controller';
import expressJoiValidation from 'express-joi-validation';
import { bookValidationSchema } from './book.validation'; // Define bookValidationSchema in a separate file

const router = express.Router();
const validator = expressJoiValidation.createValidator({ passError: true });
const bookController = new BookController();

router.post('/', validator.body(bookValidationSchema), bookController.createBook);
router.put('/:id', validator.body(bookValidationSchema), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.get('/:id', bookController.getBook);

export default router;
