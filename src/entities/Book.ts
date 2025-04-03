import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PurchaseItem } from './PurchaseItem';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column({ name: 'publication_year' })
  publicationYear: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'stock_quantity' })
  stockQuantity: number;

  @Column()
  genre: string;

  @OneToMany(() => PurchaseItem, purchaseItem => purchaseItem.book)
  purchaseItems: PurchaseItem[];
} 