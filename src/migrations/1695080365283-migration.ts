import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1695080365283 implements MigrationInterface {
    name = 'Migration1695080365283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."point_record_pointrecordtype_enum" AS ENUM('prohibited', 'break', 'return', 'exit')`);
        await queryRunner.query(`CREATE TYPE "public"."point_record_justificationtype_enum" AS ENUM('adjust_time', 'certificate', 'delay', 'lack', 'holiday', 'vacation', 'day_off', 'record')`);
        await queryRunner.query(`CREATE TABLE "point_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pointRecordType" "public"."point_record_pointrecordtype_enum" NOT NULL DEFAULT 'prohibited', "justificationType" "public"."point_record_justificationtype_enum" NOT NULL DEFAULT 'record', "dateTime" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_136513a816ccbc663a537d4014b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('super_admin', 'company_admin', 'team_admin', 'collaborator', 'free_trial')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying, "name" character varying(150) NOT NULL, "cpf" character varying(14) NOT NULL, "birthDate" date NOT NULL, "phone" character varying(20) NOT NULL, "blockedUser" boolean NOT NULL DEFAULT false, "userType" "public"."user_usertype_enum" NOT NULL DEFAULT 'free_trial', CONSTRAINT "UQ_33f8892ec763985bfa02d5aa5c5" UNIQUE ("email", "cpf"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "point_record" ADD CONSTRAINT "FK_eb03f8c33306ff2392cfef7f3e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "point_record" DROP CONSTRAINT "FK_eb03f8c33306ff2392cfef7f3e5"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
        await queryRunner.query(`DROP TABLE "point_record"`);
        await queryRunner.query(`DROP TYPE "public"."point_record_justificationtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."point_record_pointrecordtype_enum"`);
    }

}
