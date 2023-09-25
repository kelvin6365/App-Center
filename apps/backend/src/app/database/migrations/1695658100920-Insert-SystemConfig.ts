import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSystemConfig1695658100920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.settings (id, created_at, updated_at, deleted_at, version, created_by, updated_by, key, config, type, "isSystemConfig") VALUES ('fafc8753-a5c5-4d7a-873c-8f8bda9e6767', '2023-09-19 06:12:49.829315', '2023-09-19 06:12:49.829315', null, 1, null, null, 'DISABLE_REGISTER', '{"value": true}', 'PUBLIC', true);
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM public.settings WHERE id = 'fafc8753-a5c5-4d7a-873c-8f8bda9e6767';`
    );
  }
}
