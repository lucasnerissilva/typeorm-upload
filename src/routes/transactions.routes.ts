import { getCustomRepository } from 'typeorm';
import { Router } from 'express';
import multer from 'multer';

import csvUploadConfig from '../config/csv-upload';

import TransactionBalance from '../dtos/TransactionBalance';
import TransactionDetail from '../dtos/TransactioDetail';
import CreateTransaction from '../dtos/TransactionDto';

import ImportTransactionsService from '../services/ImportTransactionsService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';

const transactionsRouter = Router();

const csvUpload = multer(csvUploadConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find();
  let balance: TransactionBalance | undefined;

  if (transactions && transactions.length)
    balance = await repository.getBalance(transactions);

  return response.status(200).send({
    transactions,
    balance,
  } as TransactionDetail);
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const service = new CreateTransactionService();
  const createTransactionn = request.body as CreateTransaction;

  const transaction = await service.execute(createTransactionn);

  return response.status(201).send(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const service = new DeleteTransactionService();

  const { id } = request.params;
  await service.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  csvUpload.single('file'),
  async (request, response) => {
    // TODO
    const service = new ImportTransactionsService();
    const transactions = await service.execute(request.file.filename);

    return response.status(201).send(transactions);
  },
);

export default transactionsRouter;
