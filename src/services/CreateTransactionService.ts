import { getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoryRepository';

import CreateTransaction from '../dtos/TransactionDto';
import Transaction from '../models/Transaction';
import TransactionType from '../models/enums/TransactionType';
import TransactionBalance from '../dtos/TransactionBalance';
import AppError from '../errors/AppError';

class CreateTransactionService {
  public async execute(
    createTransaction: CreateTransaction,
  ): Promise<Transaction> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    if (!createTransaction.category)
      throw new AppError('category can not be null', 400);

    if (!createTransaction.title)
      throw new AppError('title can not be null', 400);
    if (!createTransaction.type)
      throw new AppError('type can not be null', 400);
    if (!createTransaction.value)
      throw new AppError('value can not be null', 400);

    if (createTransaction.type === TransactionType.outcome) {
      const transactions = await transactionRepository.find();

      let balance: TransactionBalance | undefined;

      if (transactions && transactions.length)
        balance = transactionRepository.getBalance(transactions);

      if (!balance || balance.total < createTransaction.value)
        throw new AppError('your balance is insuficient', 400);
    }

    let category = await categoryRepository.findByTitle(
      createTransaction.category,
    );

    if (!category) {
      category = categoryRepository.create({
        title: createTransaction.category,
      });

      await categoryRepository.save(category);
    }

    const transaction = transactionRepository.create({
      title: createTransaction.title,
      type: createTransaction.type,
      value: createTransaction.value,
      category: category,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
