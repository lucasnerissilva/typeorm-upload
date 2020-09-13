import Transaction from '../models/Transaction';
import TransactionBalance from './TransactionBalance';

interface TransactionDetail {
  transactions: Transaction[];
  balance: TransactionBalance;
}
export default TransactionDetail;
