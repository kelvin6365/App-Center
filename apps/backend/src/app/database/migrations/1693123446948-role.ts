import { MigrationInterface, QueryRunner } from 'typeorm';

export class role1693123446948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.role (id, version, created_by, updated_by, type, name, description) VALUES ('0db23208-82d8-4718-93eb-9a40fc78742e',  1, null, null, 'ADMIN',  'Admin', 'Admin Role');`
    );

    await queryRunner.query(
      `INSERT INTO public.role (id, version, created_by, updated_by, type, name, description) VALUES ('66b92805-9cdd-475a-80c5-40c4a776f5f8',  1, null, null, 'USER', 'User', 'User Role');`
    );
  }

  public async down(): Promise<void> {
    return;
  }
}
