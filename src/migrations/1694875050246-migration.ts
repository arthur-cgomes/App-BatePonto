import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694875050246 implements MigrationInterface {
  name = 'Migration1694875050246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."point_record_justificationtype_enum" RENAME TO "point_record_justificationtype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."point_record_justificationtype_enum" AS ENUM('adjust_time', 'certificate', 'delay', 'lack', 'holiday', 'vacation', 'day_off', 'record')`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_record" ALTER COLUMN "justificationType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_record" ALTER COLUMN "justificationType" TYPE "public"."point_record_justificationtype_enum" USING "justificationType"::"text"::"public"."point_record_justificationtype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_record" ALTER COLUMN "justificationType" SET DEFAULT 'record'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."point_record_justificationtype_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."point_record_justificationtype_enum_old" AS ENUM('adjust_time', 'certificate', 'delay', 'lack', 'holiday', 'vacation', 'day_off')`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_record" ALTER COLUMN "justificationType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_record" ALTER COLUMN "justificationType" TYPE "public"."point_record_justificationtype_enum_old" USING "justificationType"::"text"::"public"."point_record_justificationtype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_record" ALTER COLUMN "justificationType" SET DEFAULT 'adjust_time'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."point_record_justificationtype_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."point_record_justificationtype_enum_old" RENAME TO "point_record_justificationtype_enum"`,
    );
  }
}
