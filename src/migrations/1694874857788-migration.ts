import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694874857788 implements MigrationInterface {
  name = 'Migration1694874857788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."point_record_justificationtype_enum" AS ENUM('adjust_time', 'certificate', 'delay', 'lack', 'holiday', 'vacation', 'day_off')`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_record" ADD "justificationType" "public"."point_record_justificationtype_enum" NOT NULL DEFAULT 'adjust_time'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "point_record" DROP COLUMN "justificationType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."point_record_justificationtype_enum"`,
    );
  }
}
