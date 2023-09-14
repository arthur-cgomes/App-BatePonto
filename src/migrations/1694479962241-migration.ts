import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1694479962241 implements MigrationInterface {
  name = 'Migration1694479962241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_usertype_enum" AS ENUM('super_admin', 'company_admin', 'team_admin', 'collaborator', 'free_trial')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying, "name" character varying(150) NOT NULL, "cpf" character varying(14) NOT NULL, "birthDate" date NOT NULL, "phone" character varying(20) NOT NULL, "blockedUser" boolean NOT NULL DEFAULT false, "userType" "public"."user_usertype_enum" NOT NULL DEFAULT 'free_trial', CONSTRAINT "UQ_33f8892ec763985bfa02d5aa5c5" UNIQUE ("email", "cpf"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
  }
}
