import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694730614597 implements MigrationInterface {
    name = 'Migration1694730614597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_record" ADD "dateTime" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "point_record" DROP CONSTRAINT "FK_eb03f8c33306ff2392cfef7f3e5"`);
        await queryRunner.query(`ALTER TABLE "point_record" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "point_record" ADD CONSTRAINT "FK_eb03f8c33306ff2392cfef7f3e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_record" DROP CONSTRAINT "FK_eb03f8c33306ff2392cfef7f3e5"`);
        await queryRunner.query(`ALTER TABLE "point_record" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "point_record" ADD CONSTRAINT "FK_eb03f8c33306ff2392cfef7f3e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "point_record" DROP COLUMN "dateTime"`);
    }

}
