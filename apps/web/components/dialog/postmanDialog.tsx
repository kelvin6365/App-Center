"use client";
import CodeBlock from "@/components/codeBlock/codeBlock";
import { App } from "@/types/App";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icons } from "@/components/icons";

type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  app: App | null;
};

const PostmanDialog = ({
  title,
  onClose,
  open,
  app,
  description: modelDescription,
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
    setFilePath("/PATH-TO-FILE/FILE.{ipa/apk}");
    if (app?.extra?.jiraCredential) {
      setJiraIssues("JIRA-001,JIRA-002,JIRA-003");
    }
  };

  const codeString = () => {
    if (!app) return "";

    return `curl --location '${process.env.NEXT_PUBLIC_API_HOST}/v1/app/${app.id}/version'  \\
--form 'name="${name}"'  \\
--form 'description="${description}"'  \\
--form 'file=@"${filePath}"'  \\
--form 'apiKey="${app?.apiKey}"'  \\
${
  app.extra?.jiraCredential
    ? `--form 'tags="${tags}"'  \\
--form 'jiraIssues="${jiraIssues ?? ""}"'  \\`
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
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>{modelDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("Version Name")}</Label>
              <Input
                onChange={(e) => setName(e.target.value)}
                defaultValue={name}
                placeholder="e.g., 1.0.0"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Description")}</Label>
              <Input
                onChange={(e) => setDescription(e.target.value)}
                defaultValue={description}
                placeholder="Version description"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Install Password")}</Label>
              <Input
                onChange={(e) => setInstallPassword(e.target.value)}
                defaultValue={installPassword}
                type="password"
                placeholder="Set install password"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("Version Tags")}</Label>
              <Input
                onChange={(e) => setTags(e.target.value)}
                defaultValue={tags}
                placeholder="e.g., stable,production"
              />
            </div>
            {app?.extra?.jiraCredential && (
              <div className="space-y-2">
                <Label>{t("Jira Issues")}</Label>
                <Input
                  onChange={(e) => setJiraIssues(e.target.value)}
                  defaultValue={jiraIssues}
                  placeholder="e.g., PROJ-123,PROJ-456"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>{t("File Path")}</Label>
              <Input
                onChange={(e) => setFilePath(e.target.value)}
                defaultValue={filePath}
                placeholder="/path/to/your/app.{ipa/apk}"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("cURL")}</Label>
            <div className="relative rounded-lg border bg-muted">
              <CodeBlock text={app ? codeString() : ""} language="bash" />
            </div>
          </div>
        </div>

        <DialogFooter>
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

export default PostmanDialog;
