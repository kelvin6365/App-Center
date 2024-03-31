'use client';
import CodeBlock from '@/components/codeBlock/codeBlock';
import { App } from '@/types/App';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@app-center/shadcn/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MdOpenInNew } from 'react-icons/md';
type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  app: App | null;
};

const GitLabCICodeDialog = ({
  title,
  onClose,
  open,
  description: modelDescription,
  app,
}: Props) => {
  const t = useTranslations('Apps');
  const [name, setName] = useState('APP_VERSION_NAME');
  const [description, setDescription] = useState('APP_VERSION_DESCRIPTION');
  const [installPassword, setInstallPassword] = useState('INSTALL_PASSWORD');
  const [tags, setTags] = useState('Tag1,Tag2,Tag3');
  const [jiraIssues, setJiraIssues] = useState('JIRA-001,JIRA-002,JIRA-003');
  const [filePath, setFilePath] = useState('/PATH-TO-FILE/FILE.{ipa/apk}');
  const reset = () => {
    setName('APP_VERSION_NAME');
    setDescription('APP_VERSION_DESCRIPTION');
    setInstallPassword('INSTALL_PASSWORD');
    setTags('Tag1,Tag2,Tag3');
    setFilePath('./PATH-TO-FILE/FILE.{ipa/apk}');
    if (app?.extra?.jiraCredential) {
      setJiraIssues('JIRA-001,JIRA-002,JIRA-003');
    }
  };
  const codeString = () => {
    if (!app) {
      return '';
    }
    return `##Upload To App Center Stage
    upload_to_app_center:
        stage: app_center
        image: curlimages/curl:latest
        script: 
          - |
            curl -f --location '${window.location.origin}/api/v1/app/${
      app?.id
    }/version'  \\
            --form 'name="${name}"'  \\
            --form 'description="${description}"'  \\
            --form 'file=@"${filePath}"'  \\
            --form 'apiKey="${app?.apiKey}"'  \\
            ${
              app?.extra?.jiraCredential
                ? `--form 'tags="${tags}"'  \\
            --form 'jiraIssues="${jiraIssues ?? ''}"'  \\`
                : `--form 'tags="${tags}"'  \\`
            }
            --form 'installPassword="${installPassword}"'`;
  };
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        reset();
      }}
      // className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogContent className="max-w-[70%] w-full max-h-[85%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{modelDescription}</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>{t('Version Name')}</Label>
              <Input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                defaultValue={name}
                autoFocus={false}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>{t('Description')}</Label>
              <Input
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                defaultValue={description}
                autoFocus={false}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>{t('Install Password')}</Label>
              <Input
                onChange={(e) => {
                  setInstallPassword(e.target.value);
                }}
                defaultValue={installPassword}
                autoFocus={false}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>{t('Version Tags')}</Label>
              <Input
                onChange={(e) => {
                  setTags(e.target.value);
                }}
                defaultValue={tags}
                autoFocus={false}
              />
            </div>
            {app?.extra?.jiraCredential && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>{t('Jira Issues')}</Label>
                <Input
                  onChange={(e) => {
                    setJiraIssues(e.target.value);
                  }}
                  defaultValue={jiraIssues}
                  autoFocus={false}
                />
              </div>
            )}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>{t('File Path')}</Label>
              <Input
                onChange={(e) => {
                  setFilePath(e.target.value);
                }}
                defaultValue={filePath}
                autoFocus={false}
              />
            </div>
          </div>
          <div className="py-2">
            <div className="text-base font-bold text-black">gitlab-ci.yml</div>
            <span className="pb-4 text-xs font-thin text-purple-800">
              <a
                target="_blank"
                href="https://docs.gitlab.com/ee/ci/triggers/#use-a-cicd-job"
                rel="noreferrer"
                className="flex"
              >
                <p className="my-auto">
                  - {t('How to use cURL in a CI/CD job')}
                </p>{' '}
                <MdOpenInNew className="my-auto ml-1" />
              </a>
            </span>
          </div>
          <div className="h-[420px]"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <CodeBlock text={codeString()} language={'yaml'} />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              onClose();
              reset();
            }}
          >
            <span>{t('Done')}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GitLabCICodeDialog;
