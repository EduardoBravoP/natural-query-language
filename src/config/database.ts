import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Book } from '../entities/Book';
import { Purchase } from '../entities/Purchase';
import { PurchaseItem } from '../entities/PurchaseItem';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'bookstore',
  password: process.env.DB_PASSWORD || 'bookstore123',
  database: process.env.DB_NAME || 'bookstore',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Book, Purchase, PurchaseItem],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
}); 