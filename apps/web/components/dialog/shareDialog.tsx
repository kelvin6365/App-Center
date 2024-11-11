import { AppVersion } from "@/types/AppVersion";
import { useState } from "react";
import { IoIosCopy } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  data: AppVersion | null;
};

const ShareDialog = ({ title, onClose, open, data, description }: Props) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("Apps");
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
      }}
      // className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("Public Share URL")}</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  readOnly
                  value={
                    data
                      ? `${window.location.origin}/install/${data.appId}?versionId=${data.id}`
                      : ""
                  }
                  className="pr-10"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => {
                    if (!copied) {
                      setCopied(true);
                      navigator.clipboard.writeText(
                        `${window.location.origin}/install/${data?.appId}?versionId=${data?.id}`,
                      );
                      setTimeout(() => setCopied(false), 3000);
                    }
                  }}
                >
                  {copied ? (
                    <Icons.check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Icons.copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("Anyone who has this link will be able to view this")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onClose()}>{t("Done")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
