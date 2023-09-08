import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694210173962 implements MigrationInterface {
  name = 'Migration1694210173962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "active" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "active" SET DEFAULT true`,
    );
  }
}
