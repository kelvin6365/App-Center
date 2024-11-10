import { MigrationInterface, QueryRunner } from 'typeorm';

export class Role1693123446947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create table if not exists public.role
    (
        id          uuid      default uuid_generate_v4() not null
            constraint "PK_b36bcfe02fc8de3c57a8b2391c2"
                primary key,
        created_at  timestamp default now()              not null,
        updated_at  timestamp default now()              not null,
        deleted_at  timestamp,
        version     integer                              not null,
        created_by  uuid,
        updated_by  uuid,
        type        varchar                              not null,
        name        varchar,
        description varchar
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table if exists public.role;`);
  }
}
