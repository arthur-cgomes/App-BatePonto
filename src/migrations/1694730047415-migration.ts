import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694730047415 implements MigrationInterface {
  name = 'Migration1694730047415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."point_record_pointrecordtype_enum" AS ENUM('prohibited', 'break', 'return', 'exit')`,
    );
    await queryRunner.query(
      `CREATE TABLE "point_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pointRecordType" "public"."point_record_pointrecordtype_enum" NOT NULL DEFAULT 'prohibited', "userId" uuid, CONSTRAINT "PK_136513a816ccbc663a537d4014b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "point_record" ADD CONSTRAINT "FK_eb03f8c33306ff2392cfef7f3e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "point_record" DROP CONSTRAINT "FK_eb03f8c33306ff2392cfef7f3e5"`,
    );
    await queryRunner.query(`DROP TABLE "point_record"`);
    await queryRunner.query(
      `DROP TYPE "public"."point_record_pointrecordtype_enum"`,
    );
  }
}
