import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../config/database';
import { Purchase } from '../entities/Purchase';
import { PurchaseItem } from '../entities/PurchaseItem';
import { Book } from '../entities/Book';
import { redisClient } from '../config/redis';

const purchaseRepository = AppDataSource.getRepository(Purchase);

interface PurchaseItemRequest {
  bookId: string;
  quantity: number;
}

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, items } = req.body;
    const purchaseItems: PurchaseItemRequest[] = items;

    // Start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const itemsToSave: PurchaseItem[] = [];
      let totalBooks = 0;

      // Create purchase
      const purchase = new Purchase();
      purchase.userId = userId;
      purchase.totalAmount = 0;

      // Save purchase to get the ID
      const savedPurchase = await queryRunner.manager.save(purchase);

      // Process each item
      for (const item of purchaseItems) {
        const book = await queryRunner.manager.findOne(Book, {
          where: { id: item.bookId },
        });

        if (!book) {
          throw new Error(`Book with ID ${item.bookId} not found`);
        }

        if (book.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for book ${book.title}`);
        }

        // Update book stock
        book.stockQuantity -= item.quantity;
        await queryRunner.manager.save(book);

        // Create purchase item
        const purchaseItem = new PurchaseItem();
        purchaseItem.purchaseId = savedPurchase.id;
        purchaseItem.bookId = book.id;
        purchaseItem.quantity = item.quantity;
        purchaseItem.unitPrice = book.price;

        itemsToSave.push(purchaseItem);
        totalAmount += book.price * item.quantity;
        totalBooks += item.quantity;
      }

      // Update purchase total amount
      savedPurchase.totalAmount = totalAmount;
      await queryRunner.manager.save(savedPurchase);

      // Save purchase items
      await queryRunner.manager.save(PurchaseItem, itemsToSave);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Update Redis
      await redisClient.incrby(`user:${userId}:book_count`, totalBooks);
      const userBookCount = await redisClient.get(`user:${userId}:book_count`);
      await redisClient.zadd('ranking:top_buyers', parseInt(userBookCount || '0'), userId);

      return res.status(201).json({
        id: savedPurchase.id,
        userId: savedPurchase.userId,
        totalAmount: savedPurchase.totalAmount,
        items: itemsToSave,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.error('Error creating purchase:', error);
    return res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
  }
};

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let purchases;

    if (userId) {
      purchases = await purchaseRepository.find({
        where: { userId: userId as string },
        relations: ['items', 'items.book'],
      });
    } else {
      purchases = await purchaseRepository.find({
        relations: ['items', 'items.book'],
      });
    }

    return res.json(purchases);
  } catch (error) {
    console.error('Error getting purchases:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPurchaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchase = await purchaseRepository.findOne({
      where: { id },
      relations: ['items', 'items.book'],
    });

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    return res.json(purchase);
  } catch (error) {
    console.error('Error getting purchase:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 