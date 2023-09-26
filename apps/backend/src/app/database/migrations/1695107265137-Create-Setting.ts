import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSetting1695107265137 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create table if not exists public.settings
    (
        id               uuid      default uuid_generate_v4()           not null
            constraint "PK_0669fe20e252eb692bf4d344975"
                primary key,
        created_at       timestamp default now()                        not null,
        updated_at       timestamp default now()                        not null,
        deleted_at       timestamp,
        version          integer                                        not null,
        created_by       uuid,
        updated_by       uuid,
        type             varchar   default 'PRIVATE'::character varying not null,
        key              varchar                                        not null
            constraint "UQ_c8639b7626fa94ba8265628f214"
                unique,
        config           jsonb                                          not null,
        "isSystemConfig" boolean   default false                        not null
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table if exists public.settings;`);
  }
}
