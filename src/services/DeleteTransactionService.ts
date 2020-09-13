import { getCustomRepository } from 'typeorm';

// import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoryRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
