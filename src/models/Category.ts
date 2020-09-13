import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
