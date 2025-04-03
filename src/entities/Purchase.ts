import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { PurchaseItem } from './PurchaseItem';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'purchase_date' })
  purchaseDate: Date;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @ManyToOne(() => User, user => user.purchases)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PurchaseItem, purchaseItem => purchaseItem.purchase, { cascade: true })
  items: PurchaseItem[];
} 