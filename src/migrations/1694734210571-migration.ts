import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694734210571 implements MigrationInterface {
  name = 'Migration1694734210571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "point_record" DROP COLUMN "dateTime"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "point_record" ADD "dateTime" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
