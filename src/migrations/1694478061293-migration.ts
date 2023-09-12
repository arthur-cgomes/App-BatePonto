import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694478061293 implements MigrationInterface {
    name = 'Migration1694478061293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "active" TO "blockedUser"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "blockedUser" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "blockedUser" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "blockedUser" TO "active"`);
    }

}
