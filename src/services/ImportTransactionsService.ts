import { getCustomRepository } from 'typeorm';
import csvParse from 'csv-parse';
import path from 'path';
import fs from 'fs';

import Transaction from '../models/Transaction';

import { csvFileDirectory } from '../config/csv-upload';
import AppError from '../errors/AppError';

import CreateTransaction from '../dtos/TransactionDto';
import TransactionType from '../models/enums/TransactionType';
import TransactionsRepository from '../repositories/TransactionsRepository';
import TransactionBalance from '../dtos/TransactionBalance';
import CategoriesRepository from '../repositories/CategoryRepository';

class ImportTransactionsService {
  async execute(csvFileName: string): Promise<Transaction[]> {
    // TODO
    const categoryRepository: CategoriesRepository = getCustomRepository(
      CategoriesRepository,
    );

    const transactionRepository: TransactionsRepository = getCustomRepository(
      TransactionsRepository,
    );

    const file = path.join(csvFileDirectory, csvFileName);
    const readCSVStream = fs.createReadStream(file);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const createTrannsactions: CreateTransaction[] = [];
    const transactions: Transaction[] = [];

    parseCSV.on('data', async item => {
      const line = item.toString() as string;

      if (line) {
        let transactionLineDetails: string[] = [];

        if (line.includes(';')) transactionLineDetails = line.split(';');

        if (line.includes(',')) transactionLineDetails = line.split(',');

        if (transactionLineDetails && transactionLineDetails.length) {
          let title: string = '';
          let type: string = '';
          let value: number = 0;
          let category: string = '';

          if (!transactionLineDetails[0])
            throw new AppError('title can not be null', 400);
          else title = transactionLineDetails[0];
          if (!transactionLineDetails[1])
            throw new AppError('type can not be null', 400);
          else type = transactionLineDetails[1];
          if (!transactionLineDetails[2])
            throw new AppError('value can not be null', 400);
          else {
            try {
              value = Number.parseInt(transactionLineDetails[2]);
            } catch {
              throw new AppError('invalid type to value', 400);
            }
          }
          if (!transactionLineDetails[3])
            throw new AppError('category can not be null', 400);
          else category = transactionLineDetails[3];

          createTrannsactions.push({
            value,
            title,
            type,
            category,
          });
        }
      }
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    for (const createTransaction of createTrannsactions) {
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

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
