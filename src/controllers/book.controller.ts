import { Request, Response } from 'express';
import BookService from './book.service';

const bookService = new BookService();

export class BookController {
  async createBook(req: Request, res: Response) {
    try {
      const { room_id, user_id, price, person, booker, desc, status } = req.body;
      const book = await bookService.createBook({ room_id, user_id, price, person, booker, desc, status });
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Error creating book' });
    }
  }

  async updateBook(req: Request, res: Response) {
    const bookId = parseInt(req.params.id);
    const { room_id, user_id, price, person, booker, desc, status } = req.body;

    try {
      const book = await bookService.updateBook(bookId, { room_id, user_id, price, person, booker, desc, status });
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating book' });
    }
  }

  async deleteBook(req: Request, res: Response) {
    const bookId = parseInt(req.params.id);

    try {
      const book = await bookService.deleteBook(bookId);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting book' });
    }
  }

  async getBook(req: Request, res: Response) {
    const bookId = parseInt(req.params.id);

    try {
      const book = await bookService.getBook(bookId);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching book' });
    }
  }
}

export default new BookController();
