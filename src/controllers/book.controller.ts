import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';

const bookRepository = AppDataSource.getRepository(Book);

export const createBook = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, publisher, publicationYear, price, stockQuantity, genre } = req.body;

    const book = bookRepository.create({
      title,
      author,
      publisher,
      publicationYear,
      price,
      stockQuantity,
      genre,
    });

    await bookRepository.save(book);

    return res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { genre, author } = req.query;
    
    let queryBuilder = bookRepository.createQueryBuilder('book');

    if (genre) {
      queryBuilder = queryBuilder.andWhere('book.genre = :genre', { genre });
    }

    if (author) {
      queryBuilder = queryBuilder.andWhere('book.author ILIKE :author', { author: `%${author}%` });
    }

    const books = await queryBuilder.getMany();
    return res.json(books);
  } catch (error) {
    console.error('Error getting books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookRepository.findOne({ where: { id } });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(book);
  } catch (error) {
    console.error('Error getting book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, author, publisher, publicationYear, price, stockQuantity, genre } = req.body;

    const book = await bookRepository.findOne({ where: { id } });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = title;
    book.author = author;
    book.publisher = publisher;
    book.publicationYear = publicationYear;
    book.price = price;
    book.stockQuantity = stockQuantity;
    book.genre = genre;

    await bookRepository.save(book);

    return res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookRepository.findOne({ where: { id } });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await bookRepository.remove(book);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 