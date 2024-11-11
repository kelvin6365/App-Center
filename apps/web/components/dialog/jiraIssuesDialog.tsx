import Loading from "@/components/loading";
import API from "@/services/api";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import axios from "axios";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { App } from "../../types/App";
import { AppVersion } from "../../types/AppVersion";
import { Button } from "@repo/ui/components/ui/button";

type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  onReload: () => Promise<void>;
  open: boolean;
  app: App | null;
  data: AppVersion | null;
};

const JiraIssuesDialog = ({
  title,
  onClose,
  onReload,
  open,
  app,
  data,
  description,
}: Props) => {
  const t = useTranslations("Apps");
  const [loading, setLoading] = useState(false);

  const onDelete = async (issueId: string) => {
    if (!app || !data) return;

    try {
      setLoading(true);
      const res = await API.app.removeJiraIssue(app.id, data.id, issueId);
      if (!res.data.data) {
        throw new Error("Delete failed");
      }
      await onReload();
      toast.success(t("Delete Successfully"));
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[99999] bg-background/80 backdrop-blur-sm">
          <Loading fullScreen />
        </div>
      )}
      <Dialog open={open} onOpenChange={() => !loading && onClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {data?.jiraIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted group"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={loading}
                  onClick={() => onDelete(issue.id)}
                >
                  <Icons.trash className="h-4 w-4 text-destructive" />
                </Button>

                <a
                  href={issue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 flex-1 hover:text-primary"
                >
                  <Image
                    src={issue.iconUrl}
                    alt={issue.summary}
                    width={20}
                    height={20}
                    className="rounded"
                  />
                  <span className="font-medium min-w-[100px]">
                    {issue.issueIdOrKey}
                  </span>
                  <span className="text-muted-foreground">{issue.summary}</span>
                  <Icons.externalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100" />
                </a>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JiraIssuesDialog;
