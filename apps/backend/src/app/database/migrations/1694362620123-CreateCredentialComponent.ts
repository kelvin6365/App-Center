import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCredentialComponent1694362620123
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create table if not exists public.credential_components
    (
        id          uuid      default uuid_generate_v4() not null
            constraint "PK_d3a2c6fe030171d8c785df64ef8"
                primary key,
        created_at  timestamp default now()              not null,
        updated_at  timestamp default now()              not null,
        deleted_at  timestamp,
        version     integer                              not null,
        created_by  uuid,
        updated_by  uuid,
        label       varchar                              not null,
        icon        varchar                              not null,
        name        varchar                              not null,
        description varchar,
        inputs      jsonb                                not null
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `drop table if exists public.credential_components;`
    );
  }
}
