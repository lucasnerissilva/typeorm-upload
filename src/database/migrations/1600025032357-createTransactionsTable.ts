import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTransactionsTable1600025032357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
          new Table({
            name: 'transactions',
            columns: [
              {
                name: 'id',
                type: 'varchar',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
              },
              {
                name: 'title',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'type',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'value',
                type: 'int',
                isNullable: false,
              },
              {
                name: 'category_id',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'created_at',
                type: 'timestamp',
                default: 'now()',
                isNullable: false,
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                isNullable: true,
              },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('transactions');
      }

}
