import { EntityRepository, Repository } from 'typeorm';
import TransactionBalance from '../dtos/TransactionBalance';

import Transaction from '../models/Transaction';
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async add(transaction: Transaction): Promise<Transaction> {
    return await this.save(transaction);
  }

  public getBalance(transactions: Transaction[]): TransactionBalance {
    // TODO
    const incomeTransactions = transactions.filter(t => t.type === 'income');

    let income = 0;

    if (incomeTransactions && incomeTransactions.length)
      income = incomeTransactions.map(t => t.value).reduce((a, b) => a + b);

    let outcome = 0;

    const outcomeTransactions = transactions.filter(t => t.type === 'outcome');

    if (outcomeTransactions && outcomeTransactions.length)
      outcome = outcomeTransactions.map(t => t.value).reduce((a, b) => a + b);

    return { income, outcome, total: income - outcome } as TransactionBalance;
  }
}

export default TransactionsRepository;
