import { MigrationInterface, QueryRunner } from 'typeorm';

export class Permission1693145873440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create table if not exists public.permissions
    (
        id         uuid      default uuid_generate_v4() not null
            constraint "PK_920331560282b8bd21bb02290df"
                primary key,
        created_at timestamp default now()              not null,
        updated_at timestamp default now()              not null,
        deleted_at timestamp,
        version    integer                              not null,
        created_by uuid,
        updated_by uuid,
        type       varchar                              not null
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table public.user_permission drop constraint "FK_8a4d5521c1ced158c13438df3df";`
    );
    await queryRunner.query(`drop table if exists public.permissions;`);
  }
}
