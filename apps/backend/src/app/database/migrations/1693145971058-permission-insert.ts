import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermissionInsert1693145971058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('ecaeafeb-0b11-4bcb-af5c-9a4f15aee1de', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'CREATE_APP');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('c710dbe5-d9db-421d-b4b5-7abd04a6cf9d', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'EDIT_APP');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('98e3ccbf-9450-4809-8bfd-f527b1bfe8fc', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'VIEW_APP');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('3f783226-f67e-4062-8566-cbf77c7f8f88', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'CREATE_APP_VERSION');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('b193735b-1918-47a4-9878-1209430d434f', '2023-08-27 12:41:03.288519', '2023-08-27 12:41:03.288519', null, 1, null, null, 'DELETE_APP_VERSION');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('8e3ee9d8-f109-4ae3-9cf2-d33ed05eee5a', '2023-08-27 13:28:31.208623', '2023-08-27 13:28:31.208623', null, 1, null, null, 'VIEW_ALL_APP');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('3c714bf7-8f32-4fff-a820-e69f0fa291f9', '2023-08-27 13:42:40.430489', '2023-08-27 13:42:40.430489', null, 1, null, null, 'EDIT_ALL_APP');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('6132981e-7795-4540-84be-4d7c3ec531cc', '2023-08-27 13:59:25.218706', '2023-08-27 13:59:25.218706', null, 1, null, null, 'DELETE_ALL_APP_VERSION');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('1cda4ec8-a441-43b3-b526-da21c52237ef', '2023-08-27 13:59:35.277899', '2023-08-27 13:59:35.277899', null, 1, null, null, 'CREATE_ALL_APP_VERSION');
    INSERT INTO public.permissions (id, created_at, updated_at, deleted_at, version, created_by, updated_by, type) VALUES ('23a3f8e2-ffb6-4102-aa17-1ea6f63aea8b', '2023-08-27 14:01:51.462593', '2023-08-27 14:01:51.462593', null, 1, null, null, 'CREATE_ALL_APP');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
