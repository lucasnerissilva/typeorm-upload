import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class createTransactionsCategoryFK1600025036036
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'transactions_category_id_fk',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey(
      'transactions',
      'transactions_category_id_fk',
    );
  }
}
