import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async add(category: Category): Promise<Category> {
    return await this.save(category);
  }

  public async findByTitle(title: string): Promise<Category | undefined> {
    return this.findOne({ where: { title } });
  }
}

export default CategoriesRepository;
