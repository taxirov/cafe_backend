import { Request, Response } from 'express';
import { BookService } from '../services/book.service'
import { OrderService } from '../services/order.service';

const bookService = new BookService()
const orderService = new OrderService()

export type Book = {
    id: number,
    room: {
        id: number,
        name: string,
        capacity: number
    },
    user: {
        id: number,
        name: string,
        role_id: number
    },
    price: number,
    person: number,
    booker_name: string,
    booked_date: string,
    status: number,
    create_date: string
}

export class BookController {
    async get(req: Request, res: Response) {
        try {
            const { status } = req.query
            if (status != undefined) {
                const booksByStatus = await bookService.findByStatus(+status)
                res.status(200).json({
                    books: booksByStatus,
                    status: +status
                })
            } else {
                const books = await bookService.findMany()
                res.status(200).json({
                    books,
                    status: null
                })
            }
        } catch (e) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }
    async post(req: Request, res: Response) {
        try {
            const payload = res.locals.payload
            const { room_id, person, price, booker_name, booked_date } = req.body
            const book_exsist = await bookService.findByBookedDate(booked_date)
            if (book_exsist) {
                res.status(409).json({ book: book_exsist })
            } else {
                const book_created = await bookService.create(+room_id, payload.id, +price, +person, booker_name, booked_date)
                res.status(201).json({ book: book_created })
            }
        } catch (e) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }
    async put(req: Request, res: Response) {
        try {
            const payload = res.locals.payload
            const { id } = req.params
            const { room_id, person, price, booker_name, booked_date } = req.body
            const book_exsist = await bookService.findById(+id)
            if (!book_exsist) {
                res.status(404).json({ message: "Book not found" })
            } else {
                const bookByDate = await bookService.findByBookedDate(booked_date)
                if (bookByDate) {
                    if (bookByDate.booked_date == book_exsist.booked_date) {
                        const book_updated = await bookService.update(+id, +room_id, payload.id, +price, +person, booker_name, booked_date)
                        res.status(200).json({ book: book_updated })
                    } else {
                        res.status(409).json({ book: bookByDate })
                    }
                } else {
                    const book_updated = await bookService.update(+id, +room_id, payload.id, +price, +person, booker_name, booked_date)
                    res.status(200).json({ book: book_updated })
                }
            }
        } catch (e) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            const book_exsist = await bookService.findById(+id)
            if (!book_exsist) {
                res.status(404).json({ message: "Book not found" })
            } else {
                const book_deleted = await bookService.delete(+id)
                res.status(200).json({ book: book_deleted })
            }
        } catch (e) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }
    async status(req: Request, res: Response) {
        try {
            const books: Book[] = req.body.books
            for (let i in books) {
                let book_exsist = await bookService.findById(books[i].id)
                if (book_exsist && book_exsist.status == 1) {
                    let create_date = new Date()
                    await orderService.create({ room_id: books[i].room.id, user_id: books[i].user.id, create_date: create_date.toJSON(), desc: `${books[i].booked_date}. Mijoz ${books[i].booker_name}. Mijozlar soni ${books[i].person}. Bron narxi ${books[i].price}`, title: books[i].booker_name })
                    await bookService.updateStatus(books[i].id, 0)
                }
            }
            res.status(200)
        } catch (e) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }
    async date(req: Request, res: Response) {
        try {
            const { date } = req.query
            if (date != undefined) {
                const book_abet = await bookService.findByBookedDate(date + ' abet')
                const book_gech = await bookService.findByBookedDate(date + ' gech')
                if (book_abet && book_abet.status == 1) {
                    if (book_gech && book_gech.status == 1) {
                        res.status(200).json({
                            books: [book_abet, book_gech]
                        })
                    } else {
                        res.status(200).json({
                            books: [book_abet]
                        })
                    }
                } else if (book_gech && book_gech.status == 1) {
                    if (book_abet && book_abet.status == 1) {
                        res.status(200).json({
                            books: [book_abet, book_gech]
                        })
                    } else {
                        res.status(200).json({
                            books: [book_gech]
                        })
                    }
                } else {
                    res.status(200).json({
                        books: []
                    })
                }
            }
        } catch (e) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }
}