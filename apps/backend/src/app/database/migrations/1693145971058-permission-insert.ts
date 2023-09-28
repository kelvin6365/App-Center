import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermissionInsert1693145971058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('ecaeafeb-0b11-4bcb-af5c-9a4f15aee1de', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'CREATE_APP');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('c710dbe5-d9db-421d-b4b5-7abd04a6cf9d', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'EDIT_APP');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('98e3ccbf-9450-4809-8bfd-f527b1bfe8fc', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'VIEW_APP');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('3f783226-f67e-4062-8566-cbf77c7f8f88', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'CREATE_APP_VERSION');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('b193735b-1918-47a4-9878-1209430d434f', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'DELETE_APP_VERSION');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
