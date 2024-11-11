"use client";
import CodeBlock from "@/components/codeBlock/codeBlock";
import { Icons } from "@/components/icons";
import { App } from "@/types/App";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";

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
  const t = useTranslations("Apps");
  const [name, setName] = useState("APP_VERSION_NAME");
  const [description, setDescription] = useState("APP_VERSION_DESCRIPTION");
  const [installPassword, setInstallPassword] = useState("INSTALL_PASSWORD");
  const [tags, setTags] = useState("Tag1,Tag2,Tag3");
  const [jiraIssues, setJiraIssues] = useState("JIRA-001,JIRA-002,JIRA-003");
  const [filePath, setFilePath] = useState("/PATH-TO-FILE/FILE.{ipa/apk}");

  const reset = () => {
    setName("APP_VERSION_NAME");
    setDescription("APP_VERSION_DESCRIPTION");
    setInstallPassword("INSTALL_PASSWORD");
    setTags("Tag1,Tag2,Tag3");
    setFilePath("./PATH-TO-FILE/FILE.{ipa/apk}");
    if (app?.extra?.jiraCredential) {
      setJiraIssues("JIRA-001,JIRA-002,JIRA-003");
    }
  };

  const codeString = () => {
    if (!app) return "";

    return `# Upload To App Center Stage
upload_to_app_center:
  stage: app_center
  image: curlimages/curl:latest
  script: 
    - |
      curl -f --location '${process.env.NEXT_PUBLIC_API_HOST}/v1/app/${app?.id}/version' \\
        --form 'name="${name}"' \\
        --form 'description="${description}"' \\
        --form 'file=@"${filePath}"' \\
        --form 'apiKey="${app?.apiKey}"' \\${
          app?.extra?.jiraCredential
            ? `
        --form 'tags="${tags}"' \\
        --form 'jiraIssues="${jiraIssues ?? ""}"' \\`
            : `
        --form 'tags="${tags}"' \\`
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
    >
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>{modelDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("Version Name")}</Label>
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="e.g., 1.0.0"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Description")}</Label>
              <Input
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Version description"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Install Password")}</Label>
              <Input
                onChange={(e) => setInstallPassword(e.target.value)}
                value={installPassword}
                type="password"
                placeholder="Set install password"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Version Tags")}</Label>
              <Input
                onChange={(e) => setTags(e.target.value)}
                value={tags}
                placeholder="e.g., stable,production"
              />
            </div>
            {app?.extra?.jiraCredential && (
              <div className="space-y-2">
                <Label>{t("Jira Issues")}</Label>
                <Input
                  onChange={(e) => setJiraIssues(e.target.value)}
                  value={jiraIssues}
                  placeholder="e.g., PROJ-123,PROJ-456"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>{t("File Path")}</Label>
              <Input
                onChange={(e) => setFilePath(e.target.value)}
                value={filePath}
                placeholder="/path/to/your/app.{ipa/apk}"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>gitlab-ci.yml</Label>
              <a
                href="https://docs.gitlab.com/ee/ci/triggers/#use-a-cicd-job"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                {t("How to use cURL in a CI/CD job")}
                <Icons.externalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="relative rounded-lg border bg-muted overflow-hidden">
              <div className="absolute right-2 top-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    navigator.clipboard.writeText(codeString());
                  }}
                >
                  <Icons.copy className="h-3 w-3" />
                </Button>
              </div>
              <CodeBlock text={codeString()} language="yaml" />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t">
          <Button
            onClick={() => {
              onClose();
              reset();
            }}
          >
            {t("Done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GitLabCICodeDialog;
