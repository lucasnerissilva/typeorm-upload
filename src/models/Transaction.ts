import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';
import TransactionBalance from '../dtos/TransactionBalance';
import Category from './Category';

import TransactionType from './enums/TransactionType';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  value: number;

  @Column()
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id'})
  category: Category;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
