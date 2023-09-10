import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCredentialComponent1694362717025
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.credential_components (id, created_at, updated_at, deleted_at, version, created_by, updated_by, label, name, inputs, icon, description) VALUES ('818ed222-276b-402f-b112-0edea09ef882', '2023-09-10 10:58:35.467095', '2023-09-10 10:58:35.467095', null, 1, null, null, 'Azure Open AI', 'azureOpenAIApiKey', '[{"name": "azureOpenAIApiKey", "type": "password", "label": "Azure OpenAI Api Key", "placeholder": "<AZURE OPENAI API KEY>"}]', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI5NnB4IiBoZWlnaHQ9Ijk2cHgiPjxwYXRoIGZpbGw9IiMwMzViZGEiIGQ9Ik00NiA0MEwyOS4zMTcgMTAuODUyIDIyLjgwOCAyMy45NiAzNC4yNjcgMzcuMjQgMTMgMzkuNjU1ek0xMy4wOTIgMTguMTgyTDIgMzYuODk2IDExLjQ0MiAzNS45NDcgMjguMDMzIDUuNjc4eiIvPjwvc3ZnPg==', 'Refer to <a style="text-decoration:underline; color: blueviolet;" target="_blank" href="https://learn.microsoft.com/en-us/azure/cognitive-services/openai/quickstart?tabs=command-line&pivots=rest-api#set-up">official guide</a> on how to create API key on Azure OpenAI');`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM public.credential_components WHERE id = '818ed222-276b-402f-b112-0edea09ef882';`
    );
  }
}
