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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex my-2 mt-4">
          <span
            className="inline-flex text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 cursor-pointer rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
            onClick={() => {
              if (!copied) {
                setCopied(true);
                navigator.clipboard.writeText(
                  `${window.location.origin}/install/${data?.appId}?versionId=${data?.id}`,
                );
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }
            }}
          >
            {!copied ? (
              <div className="relative flex">
                <IoIosCopy className="m-auto mx-3" />
              </div>
            ) : (
              <div className="m-auto">
                <TooltipProvider>
                  <Tooltip defaultOpen>
                    <TooltipTrigger>
                      <div className="relative">
                        <IoIosCopy className="mx-3" />
                        <TiTick className="absolute right-[0px] bottom-[-8px] text-green-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{t("Copied")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </span>
          <input
            type="text"
            id="website-admin"
            className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={
              data != null
                ? `${window.location.origin}/install/${data.appId}?versionId=${data.id}`
                : ""
            }
            readOnly
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            <span>{t("Done")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
